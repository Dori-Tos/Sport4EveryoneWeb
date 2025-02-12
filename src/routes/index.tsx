import { A } from "@solidjs/router";
import { createSignal } from "solid-js";
import Counter from "~/components/Counter";
import { MainCentered } from "~/components/Main";
import { MainHeader, MediumHeader } from "~/components/Header";
import { TableCentered } from "~/components/MainTable";
import SportTable from "~/components/SportTable";
import SportSelector from "~/components/SportSelector";
import { UnderlinedLink } from "~/components/Link";


const sportsData = [
  { "Sport": "Football" },
  { "Sport": "Tennis" },
];

const sportFieldsData = [
  { "Sport Field": "SportCity", "Distance": "1.5 km", "Opening Time": "10 - 16h", "Price": "10€/h" },
  { "Sport Field": "Falon Stadium", "Distance": "2 km", "Opening Time": "10 - 16h", "Price": "12€/h" },
];
const sportFieldscolumns = ["Sport Field", "Distance", "Opening Time", "Price"];

export default function Home() {
  const [selectedSport, setSelectedSport] = createSignal("Football");

  return (
    <MainCentered>
      <MainHeader string="Home Page"/>
      <TableCentered>
        <SportSelector data={sportsData} selectedSport={selectedSport()} setSelectedSport={setSelectedSport}/>
        <SportTable data={sportFieldsData} columns={sportFieldscolumns}></SportTable>
      </TableCentered>
      <MediumHeader string="Notifications"/>
      <TableCentered>
        <p>To Do</p>
      </TableCentered>
    </MainCentered>
  );
}
