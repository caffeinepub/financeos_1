import { Pencil, Plus, Trash2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AssetType, type PortfolioHolding } from "../backend.d";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { useActor } from "../hooks/useActor";

const assetTypes: { value: AssetType; label: string }[] = [
  { value: AssetType.Retirement, label: "Retirement" },
  { value: AssetType.MutualFund, label: "Mutual Fund" },
  { value: AssetType.ETF, label: "ETF / Equity Stocks" },
  { value: AssetType.Crypto, label: "Crypto" },
  { value: AssetType.Commodity, label: "Commodity" },
  { value: AssetType.RealEstate, label: "Real Estate" },
  { value: AssetType.FixedIncome, label: "Fixed Income" },
  { value: AssetType.Other, label: "Other" },
];

const emptyForm = {
  name: "",
  ticker: "",
  assetType: AssetType.Retirement,
  quantity: 0,
  costBasis: 0,
  currentValue: 0,
  notes: "",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default function PortfolioPage() {
  const { assetType } = useParams<{ assetType: string }>();
  const navigate = useNavigate();
  const { actor } = useActor();
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PortfolioHolding | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const currentType = (assetType as AssetType) || AssetType.Retirement;
  const filtered = holdings.filter((h) => h.assetType === currentType);
  const totalValue = filtered.reduce((s, h) => s + h.currentValue, 0);

  const load = () => {
    if (!actor) return;
    setLoading(true);
    actor
      .getAllPortfolioHoldings()
      .then(setHoldings)
      .finally(() => setLoading(false));
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: load is stable
  useEffect(load, [actor]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, assetType: currentType });
    setOpen(true);
  };
  const openEdit = (h: PortfolioHolding) => {
    setEditing(h);
    setForm({
      name: h.name,
      ticker: h.ticker,
      assetType: h.assetType,
      quantity: h.quantity,
      costBasis: h.costBasis,
      currentValue: h.currentValue,
      notes: h.notes,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      if (editing) {
        await actor.updatePortfolioHolding(editing.id, { ...editing, ...form });
      } else {
        await actor.createPortfolioHolding({
          id: crypto.randomUUID(),
          ...form,
        });
      }
      setOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!actor) return;
    await actor.deletePortfolioHolding(id);
    load();
  };

  return (
    <div data-ocid="portfolio.page" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Portfolio</h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage your investment holdings
          </p>
        </div>
        <Button
          data-ocid="portfolio.add_button"
          onClick={openAdd}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Add Holding
        </Button>
      </div>

      <Tabs
        value={currentType}
        onValueChange={(v) => navigate(`/portfolio/${v}`)}
      >
        <TabsList className="flex flex-wrap h-auto gap-1">
          {assetTypes.map((at) => (
            <TabsTrigger
              key={at.value}
              value={at.value}
              data-ocid={`portfolio.${at.value.toLowerCase()}.tab`}
            >
              {at.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          {filtered.length} holding{filtered.length !== 1 ? "s" : ""}
        </span>
        <span className="text-sm font-semibold text-emerald-700">
          Total: {fmt(totalValue)}
        </span>
      </div>

      {loading ? (
        <Skeleton className="h-48" />
      ) : filtered.length === 0 ? (
        <div
          data-ocid="portfolio.empty_state"
          className="flex flex-col items-center justify-center py-16 text-slate-400"
        >
          <TrendingUp className="w-12 h-12 mb-3 opacity-30" />
          <p className="font-medium">No holdings in this category</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm" data-ocid="portfolio.table">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Ticker</th>
                <th className="px-4 py-3 text-right">Qty</th>
                <th className="px-4 py-3 text-right">Cost Basis</th>
                <th className="px-4 py-3 text-right">Current Value</th>
                <th className="px-4 py-3 text-right">Gain/Loss</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((h, i) => {
                const gl = h.currentValue - h.costBasis * h.quantity;
                const glPct =
                  h.costBasis * h.quantity > 0
                    ? (gl / (h.costBasis * h.quantity)) * 100
                    : 0;
                return (
                  <tr
                    key={h.id}
                    data-ocid={`portfolio.item.${i + 1}`}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {h.name}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {h.ticker || "-"}
                    </td>
                    <td className="px-4 py-3 text-right">{h.quantity}</td>
                    <td className="px-4 py-3 text-right">{fmt(h.costBasis)}</td>
                    <td className="px-4 py-3 text-right">
                      {fmt(h.currentValue)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${gl >= 0 ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {fmt(gl)} ({glPct.toFixed(1)}%)
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          data-ocid={`portfolio.edit_button.${i + 1}`}
                          onClick={() => openEdit(h)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500"
                          data-ocid={`portfolio.delete_button.${i + 1}`}
                          onClick={() => del(h.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="portfolio.dialog">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Holding" : "Add Holding"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Name</Label>
                <Input
                  data-ocid="portfolio.name.input"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Ticker</Label>
                <Input
                  data-ocid="portfolio.ticker.input"
                  value={form.ticker}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, ticker: e.target.value }))
                  }
                />
              </div>
            </div>
            <div>
              <Label>Asset Type</Label>
              <Select
                value={form.assetType}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, assetType: v as AssetType }))
                }
              >
                <SelectTrigger data-ocid="portfolio.assettype.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assetTypes.map((at) => (
                    <SelectItem key={at.value} value={at.value}>
                      {at.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Quantity</Label>
                <Input
                  data-ocid="portfolio.quantity.input"
                  type="number"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, quantity: Number(e.target.value) }))
                  }
                />
              </div>
              <div>
                <Label>Cost Basis</Label>
                <Input
                  data-ocid="portfolio.costbasis.input"
                  type="number"
                  value={form.costBasis}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      costBasis: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Current Value</Label>
                <Input
                  data-ocid="portfolio.currentvalue.input"
                  type="number"
                  value={form.currentValue}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      currentValue: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                data-ocid="portfolio.notes.textarea"
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
              data-ocid="portfolio.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="portfolio.submit_button"
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
