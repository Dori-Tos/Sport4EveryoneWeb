import { A } from "@solidjs/router";
import Counter from "~/components/Counter";
import { MainCentered } from "~/components/Main";
import Header from "~/components/Header";
import { TableCentered } from "~/components/MainTable";
import SportTable from "~/components/SportTable";
import { UnderlinedLink } from "~/components/Link";

const data = [
  { "Sport Field": "SportCity", "Distance": "1.5 km", "Opening Time": "10 - 16h", "Price": "10€/h" },
  { "Sport Field": "Falon Stadium", "Distance": "2 km", "Opening Time": "10 - 16h", "Price": "12€/h" },
];

const columns = ["Sport Field", "Distance", "Opening Time", "Price"];

export default function Home() {
  return (
    <MainCentered>
      <Header string="Home Page"/>
      <TableCentered>
        <SportTable data={data} columns={columns}></SportTable>
      </TableCentered>
    </MainCentered>
  );
}
