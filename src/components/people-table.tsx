import { Person } from "@prisma/client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PersonDeleteAlertDialog from "./person-delete-alert-dialog";
import PersonDialogForm from "./person-dialog-form";
import { enAU } from "date-fns/locale";

const PeopleTable = ({ people }: { people: Person[] }) => {
  const cols = Object.keys(people[0]);

  function formatValue(value: string | Date | null, key: string) {
    let displayedValue = value ?? "";
    if (value instanceof Date && key === "date_of_birth") {
      displayedValue = format(new Date(value), "do MMM yyyy", { locale: enAU });
    } else if (
      (value instanceof Date && key === "created_at") ||
      (value instanceof Date && key === "updated_at")
    ) {
      displayedValue = format(new Date(value), "dd-MM-yyyy kk:mm:ss.SSS z", {
        locale: enAU,
      });
    } else {
      displayedValue = displayedValue.toString();
    }
    return displayedValue;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {cols.map((keyName) => {
            if (keyName !== "id" && keyName !== "user_id") {
              return (
                <TableHead key={`row-${keyName}`}>
                  {keyName.replaceAll("_", " ").toUpperCase()}
                </TableHead>
              );
            }
          })}
          <TableHead colSpan={2} className="text-center">
            ACTIONS
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {people.map((person, idx) => {
          return (
            <TableRow key={person.id}>
              {Object.entries(person).map(([key, value]) => {
                if (key !== "id" && key !== "user_id") {
                  return (
                    <TableCell key={`cell-${key}-${idx}`}>
                      {formatValue(value, key)}
                    </TableCell>
                  );
                }
              })}
              <TableCell className="flex space-x-3 justify-center">
                <PersonDialogForm key={`form-${person.id}`} person={person} />
                <PersonDeleteAlertDialog
                  key={`del-${person.id}`}
                  name={`${person.first_name} ${person.last_name}`}
                  id={person.id}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default PeopleTable;
