import { BriefcaseBusiness, MoreHorizontal, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell, CompanyGlyph, EmptyState } from "@/components/nexora";
import { Button } from "@/components/ui/button";
import { useNexoraStorage } from "@/hooks/useNexoraStorage";
import {
  applicationStatuses,
  type ApplicationRecord,
  updateApplication,
} from "../../../shared/applicationTracker";

const statuses = applicationStatuses;
export default function Applications() {
  const [records, setRecords] = useNexoraStorage<ApplicationRecord[]>(
    "nexora.applications.v1",
    []
  );
  const [openNote, setOpenNote] = useState<string | null>(null);
  const grouped = useMemo(
    () =>
      statuses.map(
        status =>
          [status, records.filter(record => record.status === status)] as const
      ),
    [records]
  );
  const update = (
    id: string,
    updates: Pick<Partial<ApplicationRecord>, "status" | "notes">
  ) => {
    setRecords(
      records.map(record =>
        record.id === id
          ? updateApplication(record, updates, new Date().toISOString())
          : record
      )
    );
    toast.success("Application updated");
  };
  return (
    <AppShell>
      <div className="page-wrap applications-page">
        <div className="page-heading">
          <div>
            <div className="eyebrow">
              <BriefcaseBusiness size={14} />
              Pipeline view
            </div>
            <h1>
              Your application <em>journey.</em>
            </h1>
            <p>
              Move each opportunity forward with the context still attached.
            </p>
          </div>
          <Button asChild>
            <a href="/discover">
              <Plus size={16} />
              Add a role
            </a>
          </Button>
        </div>
        {records.length ? (
          <div className="kanban">
            {grouped.map(([status, items]) => (
              <section className="kanban-column" key={status}>
                <header>
                  <span>{status}</span>
                  <b>{items.length}</b>
                </header>
                <div>
                  {items.map(record => (
                    <article key={record.id} className="application-card">
                      <div className="application-title">
                        <CompanyGlyph company={record.job.company} />
                        <div>
                          <h3>{record.job.title}</h3>
                          <p>{record.job.company}</p>
                        </div>
                        <button
                          onClick={() =>
                            setOpenNote(
                              openNote === record.id ? null : record.id
                            )
                          }
                          aria-label="Edit application note"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                      <small>
                        Updated{" "}
                        {new Date(record.updatedAt).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric" }
                        )}
                      </small>
                      {openNote === record.id && (
                        <div className="note-editor">
                          <textarea
                            value={record.notes}
                            onChange={event =>
                              update(record.id, { notes: event.target.value })
                            }
                            placeholder="Add a note for your future self…"
                          />
                          <select
                            value={record.status}
                            onChange={event =>
                              update(record.id, {
                                status: event.target
                                  .value as ApplicationRecord["status"],
                              })
                            }
                          >
                            {statuses.map(option => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Your application journey starts here."
            message="Track a role from its detail panel when you’re ready to make a move."
            action={
              <Button asChild>
                <a href="/discover">Find a role</a>
              </Button>
            }
          />
        )}
      </div>
    </AppShell>
  );
}
