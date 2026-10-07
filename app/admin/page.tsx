import { redirect } from "next/navigation";

/** The panel has one section today; /admin is just a door into it. */
export default function AdminIndex() {
  redirect("/admin/plans");
}
