import { execSync, exec } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import util from "util";

const execAsync = util.promisify(exec);

interface CompilerInfo {
  name: string;
  cmd: string;
  available: boolean;
}

let compilerCache: CompilerInfo[] | null = null;

function detectCompilers(): CompilerInfo[] {
  if (compilerCache) return compilerCache;

  const candidates = [
    { name: "tectonic", cmd: "tectonic" },
    { name: "pdflatex", cmd: "pdflatex" },
    { name: "xelatex", cmd: "xelatex" },
    { name: "lualatex", cmd: "lualatex" },
  ];

  compilerCache = candidates.map((c) => {
    try {
      execSync(`which ${c.cmd}`, { stdio: "ignore" });
      return { ...c, available: true };
    } catch {
      return { ...c, available: false };
    }
  });

  return compilerCache;
}

function findCompiler(): CompilerInfo | null {
  return detectCompilers().find((c) => c.available) ?? null;
}

async function compileTectonic(texPath: string, outDir: string): Promise<string> {
  await execAsync(`tectonic ${texPath} --outdir ${outDir}`, { timeout: 60000 });
  const baseName = path.basename(texPath, ".tex");
  return path.join(outDir, `${baseName}.pdf`);
}

async function compileTraditional(texPath: string, outDir: string, cmd: string): Promise<string> {
  const baseName = path.basename(texPath, ".tex");
  // First pass
  try {
    await execAsync(`${cmd} -interaction=nonstopmode -output-directory=${outDir} ${texPath}`, { timeout: 30000 });
  } catch {}
  // Second pass for references
  try {
    await execAsync(`${cmd} -interaction=nonstopmode -output-directory=${outDir} ${texPath}`, { timeout: 30000 });
  } catch {}
  return path.join(outDir, `${baseName}.pdf`);
}

async function compileWithPandoc(
  inputPath: string,
  outDir: string,
  inputFmt: string
): Promise<string> {
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const texPath = path.join(outDir, `${baseName}.tex`);
  // Convert to LaTeX first
  await execAsync(`pandoc ${inputPath} -f ${inputFmt} -t latex -o ${texPath}`, { timeout: 30000 });
  // Compile LaTeX to PDF
  const compiler = findCompiler();
  if (!compiler) throw new Error("No LaTeX compiler available");
  if (compiler.name === "tectonic") {
    return compileTectonic(texPath, outDir);
  }
  return compileTraditional(texPath, outDir, compiler.cmd);
}

export const latexService = {
  getStatus() {
    const compilers = detectCompilers();
    const hasPandoc = (() => {
      try { execSync("which pandoc", { stdio: "ignore" }); return true; }
      catch { return false; }
    })();
    return {
      compilers,
      hasPandoc,
      canCompile: compilers.some((c) => c.available),
      preferred: findCompiler()?.name ?? null,
    };
  },

  async compileLatex(texContent: string): Promise<{ pdfBuffer: Buffer; compiler: string }> {
    const compiler = findCompiler();
    if (!compiler) throw new Error("No LaTeX compiler found on this server. Install texlive or tectonic.");

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "scholar-latex-"));
    try {
      const texPath = path.join(tmpDir, "document.tex");
      fs.writeFileSync(texPath, texContent);

      let pdfPath: string;
      if (compiler.name === "tectonic") {
        pdfPath = await compileTectonic(texPath, tmpDir);
      } else {
        pdfPath = await compileTraditional(texPath, tmpDir, compiler.cmd);
      }

      const pdfBuffer = fs.readFileSync(pdfPath);
      return { pdfBuffer, compiler: compiler.name };
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  },

  async compileFromFile(
    filePath: string,
    inputFormat: string
  ): Promise<{ pdfBuffer: Buffer; compiler: string }> {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "scholar-convert-"));
    try {
      const compiler = findCompiler();
      if (!compiler && inputFormat !== "latex") {
        // Need pandoc + latex for conversion
        try { execSync("which pandoc", { stdio: "ignore" }); }
        catch { throw new Error("pandoc required for non-LaTeX input. Install pandoc + texlive."); }
      }

      let pdfPath: string;
      if (inputFormat === "latex") {
        if (!compiler) throw new Error("No LaTeX compiler found");
        const texPath = path.join(tmpDir, "document.tex");
        fs.copyFileSync(filePath, texPath);
        pdfPath = compiler.name === "tectonic"
          ? await compileTectonic(texPath, tmpDir)
          : await compileTraditional(texPath, tmpDir, compiler.cmd);
      } else {
        pdfPath = await compileWithPandoc(filePath, tmpDir, inputFormat);
      }

      const pdfBuffer = fs.readFileSync(pdfPath);
      return { pdfBuffer, compiler: compiler?.name ?? "pandoc" };
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  },
};
