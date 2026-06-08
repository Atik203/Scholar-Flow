"use client";
import { motion } from "motion/react";
import { Shield } from "lucide-react";
import Link from "next/link";

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            License
          </h1>
          <p className="text-muted-foreground mb-2">MIT License</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="prose prose-gray dark:prose-invert max-w-none mt-12 space-y-8"
        >
          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">MIT License</h2>
            <p className="text-muted-foreground leading-relaxed">
              Copyright &copy; {new Date().getFullYear()} ScholarFlow
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Permission is hereby granted, free of charge, to any person obtaining a copy
              of this software and associated documentation files (the "Software"), to deal
              in the Software without restriction, including without limitation the rights
              to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              copies of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions:
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              The above copyright notice and this permission notice shall be included in all
              copies or substantial portions of the Software.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
              AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
              LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
              SOFTWARE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">Open Source Components</h2>
            <p className="text-muted-foreground leading-relaxed">
              ScholarFlow uses various open source libraries. Each library is used under its
              respective license. Key dependencies include Next.js (MIT), React (MIT), Prisma
              (Apache 2.0), and others listed in our package.json.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              For a complete list of licenses, visit our{" "}
              <Link href="https://github.com/anomalyco/scholar-flow" target="_blank" className="text-primary hover:underline">
                GitHub repository
              </Link>.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
