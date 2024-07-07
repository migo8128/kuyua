import { Location, Profiles } from "../../types/location.type";
import { getClassNames } from "../../utils/getClassNames";

interface ProfilesSectionProps {
  profiles: Profiles;
}

const profileClasses = getClassNames(
  "flex",
  "justify-content-between",
  "surface-200",
  "border-round-2xl",
  "p-4",
  "w-full"
);

const getCircleClasses = (color: string) =>
  getClassNames("w-1rem", "h-1rem", "border-round-3xl", `bg-${color}-400`);

const getColor = (value: string) => {
  switch (value) {
    case "Very High":
      return "pink-400";
    case "High":
      return "orange-400";
    case "Medium":
      return "yellow-400";
    case "Low":
      return "green-400";
    default:
      return "grey";
  }
};

const profileRows = [
  { profile: "Impact Profile", key: "impactProfile" },
  { profile: "Dependency Profile", key: "dependencyProfile" },
  { profile: "Nature Risk Profile", key: "natureRiskProfile" },
  { profile: "Climate Risk Profile", key: "climateProfile" },
];

const ProfileLegend = () => (
  <div className="flex justify-content-between gap-4">
    <section className="flex align-items-center gap-1">
      <div className={getCircleClasses("pink")}></div>
      <p>Very high</p>
    </section>
    <section className="flex align-items-center gap-1">
      <div className={getCircleClasses("orange")}></div>
      <p>High</p>
    </section>
    <section className="flex align-items-center gap-1">
      <div className={getCircleClasses("yellow")}></div>
      <p>Medium</p>
    </section>
    <section className="flex align-items-center gap-1">
      <div className={getCircleClasses("green")}></div>
      <p>Low</p>
    </section>
  </div>
);

const ProfilesSection: React.FC<ProfilesSectionProps> = ({ profiles }) => {
  const countries = Object.keys(profiles);

  return (
    <div className="surface-200 border-round-2xl p-2 flex flex-column align-items-center">
      <div className={profileClasses}>
        <section>
          <p className={getClassNames("text-xl", "uppercase", "font-bold")}>
            Profiles
          </p>
        </section>
        <ProfileLegend />
      </div>

      {profileRows.map((row) => (
        <div
          key={row.key}
          className={getClassNames(
            "flex",
            "mb-2",
            "w-full",
            "justify-content-end",
            "align-items-center"
          )}
        >
          <div>
            <p className={getClassNames("text-right", "pr-2")}>{row.profile}</p>
          </div>
          <div className="flex">
            {countries.map((country) => (
              <div key={country} className="text-center">
                <span
                  className={getClassNames(
                    `bg-${getColor(
                      profiles[country as keyof Location["properties"]][row.key]
                    )}`,
                    "h-4rem",
                    "w-4rem",
                    "border-circle",
                    "inline-block"
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div
        className={getClassNames(
          "flex",
          "mb-2",
          "justify-content-end",
          "w-full"
        )}
      >
        {countries.map((country) => (
          <div key={country} className="w-4rem text-center">
            {country}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilesSection;
