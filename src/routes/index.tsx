import { A, createAsyncStore, useSubmissions, type RouteDefinition } from "@solidjs/router";
import { createSignal } from "solid-js";
import Counter from "~/components/Counter";
import { MainCentered } from "~/components/Main";
import { MainHeader, MediumHeader } from "~/components/Header";
import { TableCentered } from "~/components/MainTable";
import SportTable from "~/components/SportTable";
import SportSelector from "~/components/SportSelector";
import { UnderlinedLink } from "~/components/Link";
import { addSport, getSports } from "~/lib/sports";
import { addSportField, getSportFields } from "~/lib/sportFields";
import { addSportsCenter, getSportsCenters } from "~/lib/sportsCenters";

export const route = {
  preload() {
    getSports();
  },
} satisfies RouteDefinition;

export default function Home() {
  const [selectedSport, setSelectedSport] = createSignal("Football");
  const sports = createAsyncStore(() => getSports(), { initialValue: [] });
  const sportFields = createAsyncStore(() => getSportFields(), { initialValue: [] });
  const sportsCenters = createAsyncStore(() => getSportsCenters(), { initialValue: [] });

  const selectedSportId = () => {
    const sport = sports().find((s) => s.name === selectedSport());
    return sport ? sport.id : undefined;
  };

  // Filter sport fields: only those that include the selected sport's ID
  const filteredSportFieldIds = () => {
    const sportId = selectedSportId();
    if (!sportId) return [];
    return sportFields().filter((field) => field.sports.map(s => s.id).includes(sportId))
      .map((field) => field.id)
  };

  // Filter sports centers: include centers that have at least one sport field (by ID) 
  // that matches one from filteredSportFieldIds
  const filteredSportsCenters = () =>
    sportsCenters().filter((center) =>
      center.sportFields.some((field) => filteredSportFieldIds().includes(field.id))
  );

  const sportsCenterTableData = () =>
    filteredSportsCenters().map((center) => ({
      "Sports Center": center.name,
      "Location": center.location,
      "Opening Time": center.openingTime,
      "Attendance": center.attendance,
    }));

  // Define table columns for sports centers
  const sportsCenterColumns = [
    "Sports Center",
    "Location",
    "Opening Time",
    "Attendance",
  ];
  
  return (
    <MainCentered>
      <MainHeader string="Home Page"/>
      <TableCentered>
        <SportSelector 
          data={sports()} 
          selectedSport={selectedSport()} 
          setSelectedSport={setSelectedSport} 
        />
        <SportTable 
          data={sportsCenterTableData()} 
          columns={sportsCenterColumns} 
        />
      </TableCentered>
      <MediumHeader string="Notifications"/>
      <TableCentered>
        <p>To Do</p>
      </TableCentered>
    </MainCentered>
  );
}
