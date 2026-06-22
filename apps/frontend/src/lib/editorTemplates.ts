export interface EditorTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  citationStyle: string;
}

export const editorTemplates: EditorTemplate[] = [
  {
    id: "blank",
    name: "Blank Document",
    description: "Start with a clean slate — no pre-filled sections.",
    sections: [""],
    citationStyle: "APA",
  },
  {
    id: "ieee",
    name: "IEEE Conference Paper",
    description:
      "Standard IEEE conference format with Abstract, Introduction, Methodology, Results, and Conclusion.",
    sections: [
      "Abstract",
      "Introduction",
      "Related Work",
      "Methodology",
      "Experimental Setup",
      "Results and Discussion",
      "Conclusion",
      "References",
    ],
    citationStyle: "IEEE",
  },
  {
    id: "acm",
    name: "ACM Conference Paper",
    description:
      "ACM SIG proceedings format with CCS concepts, Introduction, and structured sections.",
    sections: [
      "Abstract",
      "CCS Concepts",
      "Introduction",
      "Background",
      "Design and Implementation",
      "Evaluation",
      "Related Work",
      "Discussion and Future Work",
      "Conclusion",
      "References",
    ],
    citationStyle: "ACM",
  },
  {
    id: "springer",
    name: "Springer LNCS Paper",
    description:
      "Springer Lecture Notes in Computer Science (LNCS) format for conference proceedings.",
    sections: [
      "Abstract",
      "Introduction",
      "Preliminaries",
      "Proposed Approach",
      "Experimental Results",
      "Related Work",
      "Conclusion and Future Work",
      "References",
    ],
    citationStyle: "APA",
  },
  {
    id: "arxiv",
    name: "arXiv Preprint",
    description:
      "Standard preprint format suitable for arXiv submission — flexible structure.",
    sections: [
      "Abstract",
      "Introduction",
      "Methods",
      "Results",
      "Discussion",
      "Conclusion",
      "Acknowledgments",
      "References",
      "Appendices",
    ],
    citationStyle: "APA",
  },
  {
    id: "thesis",
    name: "Thesis / Dissertation",
    description:
      "Academic thesis structure with literature review, methodology, and chapters.",
    sections: [
      "Abstract",
      "Acknowledgments",
      "Table of Contents",
      "List of Figures",
      "List of Tables",
      "Chapter 1: Introduction",
      "Chapter 2: Literature Review",
      "Chapter 3: Methodology",
      "Chapter 4: Results",
      "Chapter 5: Discussion",
      "Chapter 6: Conclusion",
      "References",
      "Appendices",
    ],
    citationStyle: "APA",
  },
  {
    id: "literature-review",
    name: "Literature Review",
    description:
      "Structured review paper for synthesizing existing research on a topic.",
    sections: [
      "Abstract",
      "Introduction",
      "Search Strategy and Selection Criteria",
      "Thematic Analysis",
      "Critical Evaluation",
      "Research Gaps and Future Directions",
      "Conclusion",
      "References",
    ],
    citationStyle: "APA",
  },
];

export function getTemplate(id: string): EditorTemplate | undefined {
  return editorTemplates.find((t) => t.id === id);
}

export function templateToHtml(template: EditorTemplate): string {
  return template.sections
    .map((section) => {
      if (section.match(/^(Abstract|References|Acknowledgments?|Appendices|Table of Contents|List of)/i)) {
        return `<h2>${section}</h2><p></p>`;
      }
      return `<h2>${section}</h2><p></p>`;
    })
    .join("\n");
}
