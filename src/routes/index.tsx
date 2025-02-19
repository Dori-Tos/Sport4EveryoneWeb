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
import { addSportsCenter, getSportsCenters } from "~/lib/sportsCenter";

export const route = {
  preload() {
    getSports();
  },
} satisfies RouteDefinition;

const sportFieldsData = [
  { "Sport Field": "SportCity", "Distance": "1.5 km", "Opening Time": "10 - 16h", "Price": "10€/h" },
  { "Sport Field": "Falon Stadium", "Distance": "2 km", "Opening Time": "10 - 16h", "Price": "12€/h" },
];
const sportFieldscolumns = ["Sport Field", "Distance", "Opening Time", "Price"];

export default function Home() {
  const [selectedSport, setSelectedSport] = createSignal("Football");
  const sports = createAsyncStore(() => getSports(), {
    initialValue: [],
  });
  const filteredSports = () =>
    sports().filter((sport) => {
      return sport.name === selectedSport();
    });

  return (
    <MainCentered>
      <MainHeader string="Home Page"/>
      <TableCentered>
        <SportSelector data={filteredSports()} selectedSport={selectedSport()} setSelectedSport={setSelectedSport}/>
        <SportTable data={sportFieldsData} columns={sportFieldscolumns}></SportTable>
      </TableCentered>
      <MediumHeader string="Notifications"/>
      <TableCentered>
        <p>To Do</p>
      </TableCentered>
    </MainCentered>
  );
}
