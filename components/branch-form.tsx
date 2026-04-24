"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useI18n } from "@/components/i18n-provider";
import { useBranchStore } from "@/lib/stores/branch-store";
import { branchSelectionSchema } from "@/lib/validators";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type BranchSelectionValues = z.infer<typeof branchSelectionSchema>;

export function BranchForm() {
  const router = useRouter();
  const { t } = useI18n();
  const setBranchNumber = useBranchStore((state) => state.setBranchNumber);
  const resolverSchema = useMemo(() => branchSelectionSchema, []);
  const form = useForm<BranchSelectionValues>({
    resolver: zodResolver(resolverSchema),
    defaultValues: {
      branchNumber: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setBranchNumber(values.branchNumber);
    router.push("/dashboard");
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="branchNumber">
          {t("form.enterBranch")}
        </label>
        <Input
          id="branchNumber"
          inputMode="numeric"
          autoComplete="off"
          placeholder={t("form.branchPlaceholder")}
          className="h-14 text-base"
          {...form.register("branchNumber")}
        />
        {form.formState.errors.branchNumber ? (
          <p className="text-sm text-destructive">
            {t(form.formState.errors.branchNumber.message ?? "")}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("form.branchHint")}
          </p>
        )}
      </div>

      <Button className="h-14 w-full text-base" type="submit">
        {form.formState.isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {t("form.openingDashboard")}
          </>
        ) : (
          t("form.continue")
        )}
      </Button>
    </form>
  );
}
