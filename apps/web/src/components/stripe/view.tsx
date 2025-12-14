"use client";

import { SubscribeForm } from "./form";
import { PlanSkeleton } from "./plan-skeleton";

export function SubscribeView() {
  return (
    <div className="container max-w-5xl mx-auto py-10">
      <div className="flex flex-col gap-10 md:grid md:grid-cols-2 md:gap-16">
        <div className="md:sticky md:top-20">
          <PlanSkeleton />
        </div>
        <div className="space-y-8">
          <SubscribeForm />
        </div>
      </div>
    </div>
  );
}
