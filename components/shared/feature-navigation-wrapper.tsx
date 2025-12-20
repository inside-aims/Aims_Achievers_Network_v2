'use client';

import {ArrowLeft} from "lucide-react";
import {ReactNode} from "react";
import {Button} from "@/components/ui/button";
import {useRouter} from 'next/navigation';

const FeatureNavigationWrapper = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <div className="space-y-2 md:space-y-4">
        <Button
          variant={"outline"}
          onClick={() => router.back()}
          className="flex items-center gap-2  w-8 h-8 rounded-full p-2 border"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>
      { children }
    </section>
  );
};

export default FeatureNavigationWrapper;
