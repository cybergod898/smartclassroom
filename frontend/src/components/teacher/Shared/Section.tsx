import React, { ReactNode } from "react";
export function Section({title, children}:{title:string; children:ReactNode}) {
  return (
    <section className="tc-section">
      <header className="tc-section__header">{title}</header>
      <div className="tc-section__body">{children}</div>
    </section>
  );
}
