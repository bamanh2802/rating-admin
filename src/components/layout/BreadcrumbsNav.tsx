import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Home as HomeIcon, ChevronRight } from "@mui/icons-material";
import { useLocation, Link as RouterLink } from "react-router-dom";

const formatBreadcrumbName = (name: string): string => {
  if (!name) return "";
  return name
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

interface BreadcrumbsNavProps {
  isMobile: boolean;
}

const BreadcrumbsNav: React.FC<BreadcrumbsNavProps> = ({ isMobile }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const homeLink = (
    <Link
      key="home"
      component={RouterLink}
      to="/"
      color="inherit"
      sx={{
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        "&:hover": { textDecoration: "underline" },
      }}
    >
      <HomeIcon sx={{ mr: 0.5, fontSize: "1.2rem" }} />
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        Home
      </Typography>
    </Link>
  );

  let breadcrumbItems: React.ReactNode[] = [homeLink];

  if (isMobile && pathnames.length > 0) {
    const currentPageName = formatBreadcrumbName(
      pathnames[pathnames.length - 1]
    );
    breadcrumbItems.push(
      <Typography
        key="current"
        color="text.primary"
        sx={{ fontSize: "0.9rem", fontWeight: 500 }}
      >
        {currentPageName}
      </Typography>
    );
  } else if (!isMobile) {
    if (pathnames.length > 0) {
      pathnames.forEach((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const displayName = formatBreadcrumbName(name);

        breadcrumbItems.push(
          isLast ? (
            <Typography
              key={routeTo}
              color="text.primary"
              sx={{ fontSize: "0.9rem", fontWeight: 500 }}
            >
              {displayName}
            </Typography>
          ) : (
            <Link
              key={routeTo}
              component={RouterLink}
              to={routeTo}
              color="inherit"
              sx={{
                fontSize: "0.9rem",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {displayName}
            </Link>
          )
        );
      });
    } else {
      breadcrumbItems.push(
        <Typography
          key="dashboard"
          color="text.primary"
          sx={{ fontSize: "0.9rem", fontWeight: 500 }}
        >
          Dashboard
        </Typography>
      );
    }
  }

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<ChevronRight sx={{ fontSize: "1rem" }} />}
      sx={{
        "& .MuiBreadcrumbs-ol": { flexWrap: "nowrap" },
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {breadcrumbItems}
    </Breadcrumbs>
  );
};

export default BreadcrumbsNav;
