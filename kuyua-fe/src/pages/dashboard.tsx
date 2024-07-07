import { Image } from "primereact/image";
import { classNames } from "primereact/utils";
import { useEffect, useState } from "react";
import { fetchLocations } from "../services/api";
import { Location, Profiles } from "../types/location.type";
import StatisticsSection from "../components/dashboard/StatisticsSection";
import ChartsSection from "../components/dashboard/ChartSection";
import MapSection from "../components/dashboard/MapSection";
import ProfilesSection from "../components/dashboard/ProfilesSection";
import { NavLink } from "react-router-dom";
import { Button } from "primereact/button";
import useFetch from "../hooks/useFetch";

const Header = () => {
  const headerClasses = classNames("flex", "gap-2", "align-items-end");

  return (
    <header className="flex justify-content-between align-items-center">
      <div className={headerClasses}>
        <NavLink to="../Kuyua-logo.png">
          <Image src="" width="250" loading="lazy" />
        </NavLink>
        <h2 className={classNames("text-600", "font-light", "uppercase")}>
          Dashboard
        </h2>
      </div>
      <NavLink to="/locations">
        <Button
          label="All Locations Page"
          severity="secondary"
          icon="pi pi-map"
          outlined
        />
      </NavLink>
    </header>
  );
};

const Dashboard = () => {
  useEffect(() => {
    document.title = "Kuyua Dashboard";
  }, []);

  const { data, error, loading } = useFetch<{
    features: Location[];
    total: number;
    profiles: Profiles;
  }>("/locations", { pageSize: 10000, page: 1, field: "", order: 1 });

  const locations = data?.features || [];
  const profiles = data?.profiles || [];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const rowLayoutClassName = classNames(
    "grid",
    "flex",
    "align-items-center",
    "justify-content-between",
    "w-full"
  );

  return (
    <div>
      <Header />
      <div>
        <div className={rowLayoutClassName}>
          <StatisticsSection />
          <ChartsSection />
        </div>
        <br />
        <div className={rowLayoutClassName}>
          <div className="col-7">
            <MapSection locations={locations} />
          </div>
          <div className="col-5">
            <ProfilesSection profiles={profiles} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
