import { Request, Response } from "express";

const cspReportHandler = (req: Request, res: Response): void => {
  const report = req.body?.["csp-report"] || req.body;

  if (process.env.NODE_ENV !== "production") {
    console.warn("[CSP Violation]", JSON.stringify(report, null, 2));
  }

  res.status(204).end();
};

export { cspReportHandler };
