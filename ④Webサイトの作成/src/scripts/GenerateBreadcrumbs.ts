interface Breadcrumb {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}

// パス名を見やすい形式に変換するための関数
const formatLabel = (pathSegment: string): string => {
  switch (pathSegment) {
    case "booster":
      return "Booster";
    case "deck":
      return "Deck";
    case "lrig":
      return "Lrig";
    case "search":
      return "Search";
    default:
      return (
        pathSegment.charAt(0).toUpperCase() +
        pathSegment.slice(1).replace(/-/g, " ").replace(/_/g, " ")
      );
  }
};

export const generateBreadcrumbs = (
  pathname: string,
  searchParams: URLSearchParams
): BreadcrumbsProps => {
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs: Breadcrumb[] = [
    { label: "Home", href: "/", active: false },
  ];

  pathSegments.forEach((segment, index) => {
    const isLast = index === pathSegments.length - 1;
    // 常にクエリパラメータを含める
    const href =
      `/${pathSegments.slice(0, index + 1).join("/")}` +
      (searchParams.toString() ? `?${searchParams}` : "");

    breadcrumbs.push({
      label: formatLabel(segment),
      href: isLast ? href : href, // isLastでもhrefを設定
      active: isLast,
    });
  });

  return { breadcrumbs };
};
