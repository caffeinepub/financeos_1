import { CalendarDays, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { PlannerEvent } from "../backend.d";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Skeleton } from "../components/ui/skeleton";
import { Textarea } from "../components/ui/textarea";
import { useActor } from "../hooks/useActor";

const emptyForm = {
  title: "",
  date: "",
  amount: 0,
  eventType: "",
  notes: "",
  isCompleted: false,
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default function FinancialPlannerPage() {
  const { actor } = useActor();
  const [events, setEvents] = useState<PlannerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PlannerEvent | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!actor) return;
    setLoading(true);
    actor
      .getAllPlannerEvents()
      .then((e) =>
        setEvents([...e].sort((a, b) => a.date.localeCompare(b.date))),
      )
      .finally(() => setLoading(false));
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: load is stable
  useEffect(load, [actor]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };
  const openEdit = (e: PlannerEvent) => {
    setEditing(e);
    setForm({
      title: e.title,
      date: e.date,
      amount: e.amount,
      eventType: e.eventType,
      notes: e.notes,
      isCompleted: e.isCompleted,
    });
    setOpen(true);
  };

  const toggleComplete = async (ev: PlannerEvent) => {
    if (!actor) return;
    await actor.updatePlannerEvent(ev.id, {
      ...ev,
      isCompleted: !ev.isCompleted,
    });
    load();
  };

  const save = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      if (editing) {
        await actor.updatePlannerEvent(editing.id, { ...editing, ...form });
      } else {
        await actor.createPlannerEvent({ id: crypto.randomUUID(), ...form });
      }
      setOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!actor) return;
    await actor.deletePlannerEvent(id);
    load();
  };

  return (
    <div data-ocid="financialplanner.page" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Financial Planner
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Plan your financial milestones
          </p>
        </div>
        <Button
          data-ocid="financialplanner.add_button"
          onClick={openAdd}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Add Event
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div
          data-ocid="financialplanner.empty_state"
          className="flex flex-col items-center justify-center py-16 text-slate-400"
        >
          <CalendarDays className="w-12 h-12 mb-3 opacity-30" />
          <p className="font-medium">No planner events yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((ev, i) => (
            <Card
              key={ev.id}
              data-ocid={`financialplanner.item.${i + 1}`}
              className={ev.isCompleted ? "opacity-60" : ""}
            >
              <CardContent className="p-4 flex items-start gap-4">
                <Checkbox
                  data-ocid={`financialplanner.checkbox.${i + 1}`}
                  checked={ev.isCompleted}
                  onCheckedChange={() => toggleComplete(ev)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-semibold ${ev.isCompleted ? "line-through text-slate-400" : "text-slate-800"}`}
                    >
                      {ev.title}
                    </span>
                    {ev.eventType && (
                      <Badge variant="outline" className="text-xs">
                        {ev.eventType}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                    <span>{ev.date}</span>
                    {ev.amount > 0 && (
                      <span className="text-emerald-600 font-medium">
                        {fmt(ev.amount)}
                      </span>
                    )}
                  </div>
                  {ev.notes && (
                    <p className="text-xs text-slate-400 mt-1">{ev.notes}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    data-ocid={`financialplanner.edit_button.${i + 1}`}
                    onClick={() => openEdit(ev)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500"
                    data-ocid={`financialplanner.delete_button.${i + 1}`}
                    onClick={() => del(ev.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="financialplanner.dialog">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Event" : "Add Event"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                data-ocid="financialplanner.title.input"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date</Label>
                <Input
                  data-ocid="financialplanner.date.input"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Amount</Label>
                <Input
                  data-ocid="financialplanner.amount.input"
                  type="number"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amount: Number(e.target.value) }))
                  }
                />
              </div>
            </div>
            <div>
              <Label>Event Type</Label>
              <Input
                data-ocid="financialplanner.eventtype.input"
                value={form.eventType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, eventType: e.target.value }))
                }
                placeholder="e.g. Retirement, Home Purchase"
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                data-ocid="financialplanner.notes.textarea"
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="financialplanner.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="financialplanner.submit_button"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
