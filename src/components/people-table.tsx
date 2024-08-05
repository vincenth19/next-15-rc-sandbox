import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Person } from "@prisma/client";
import PersonDeleteAlertDialog from "./person-delete-alert-dialog";
import PersonDialogForm from "./person-dialog-form";

const PeopleTable = ({ people }: { people: Person[] }) => {
  const cols = Object.keys(people[0]);

  function formatValue(value: string | Date | null, key: string) {
    let displayedValue = value ?? "";
    if (value instanceof Date && key === "date_of_birth") {
      const newDate = new Date(value);
      displayedValue = `${newDate.getDate()}/${
        newDate.getMonth() + 1
      }/${newDate.getFullYear()}`;
    } else if (
      (value instanceof Date && key === "created_at") ||
      (value instanceof Date && key === "updated_at")
    ) {
      const dateObj = new Date(value);
      displayedValue = `${dateObj.getDate()}/${
        dateObj.getMonth() + 1
      }/${dateObj.getFullYear()}\n${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}.${dateObj.getMilliseconds()}`;
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
            return (
              <TableHead key={keyName}>
                {keyName.replaceAll("_", " ").toUpperCase()}
              </TableHead>
            );
          })}
          <TableHead colSpan={2} className="text-center">
            ACTIONS
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {people.map((person, idx) => {
          return (
            <TableRow key={idx}>
              {Object.entries(person).map(([key, value]) => {
                return (
                  <TableCell key={key}>{formatValue(value, key)}</TableCell>
                );
              })}
              <TableCell>
                <PersonDialogForm action="put" person={person} />
              </TableCell>
              <TableCell>
                <PersonDeleteAlertDialog
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
