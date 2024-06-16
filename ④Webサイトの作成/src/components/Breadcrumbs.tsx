// components/Breadcrumbs.tsx
"use client";

import Link from "next/link";

interface Breadcrumb {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
  return (
    <div className="breadcrumbs text-sm">
      <ul>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className={breadcrumb.active ? "active" : ""}>
            {breadcrumb.href ? (
              <Link href={breadcrumb.href} passHref>
                <span>{breadcrumb.label}</span>
              </Link>
            ) : (
              <span>{breadcrumb.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
