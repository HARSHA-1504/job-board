import { ArrowRight, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { AppShell, EmptyState, JobCard } from "@/components/nexora";
import { Button } from "@/components/ui/button";
import { useCareerProfile } from "@/hooks/useCareerProfile";
import { useNexoraStorage } from "@/hooks/useNexoraStorage";
import { type SavedJob } from "@/lib/nexora";

export default function Saved() {
  const [saved, setSaved] = useNexoraStorage<SavedJob[]>("nexora.saved.v1", []);
  const [career] = useCareerProfile();
  const profile = career.profile;
  const remove = (id: string) => {
    setSaved(saved.filter(item => item.job.id !== id));
    toast.success("Removed from your opportunities");
  };
  return (
    <AppShell>
      <div className="page-wrap saved-page">
        <div className="page-heading">
          <div>
            <div className="eyebrow">
              <Bookmark size={14} />
              Opportunity library
            </div>
            <h1>
              Saved <em>roles.</em>
            </h1>
            <p>Keep the work worth returning to close and easy to act on.</p>
          </div>
          <div className="saved-stat">
            <strong>{saved.length}</strong>
            <span>in your orbit</span>
          </div>
        </div>
        {saved.length ? (
          <div className="job-list compact-list">
            {saved.map(item => (
              <JobCard
                key={item.job.id}
                job={item.job}
                profile={profile}
                saved
                onSave={() => remove(item.job.id)}
                onOpen={() =>
                  toast.message(
                    "Open this role from Discover to see the full detail panel."
                  )
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nothing saved yet."
            message="When you find something interesting, save it here for later."
            action={
              <Button asChild>
                <a href="/discover">
                  Discover roles <ArrowRight size={16} />
                </a>
              </Button>
            }
          />
        )}
      </div>
    </AppShell>
  );
}
