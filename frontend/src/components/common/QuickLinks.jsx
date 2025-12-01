import React from "react";
import LinkItem from "./LinkItem";
import { BookOpen, Calendar, Users, MapPin } from "lucide-react";

export default function QuickLinks() {
  return (
    <section className="mt-10 bg-gradient-to-br from-rose-50/20 to-sky-50/10 p-6 rounded-xl">
      <h2 className="text-2xl font-extrabold text-slate-900 text-center">
        Quick Links
      </h2>

      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <LinkItem icon={<BookOpen />} label="Prospectus" />
        <LinkItem icon={<Calendar />} label="Academic Calendar" />
        <LinkItem icon={<Users />} label="Faculty Directory" />
        <LinkItem icon={<MapPin />} label="Campus Map" />
      </div>
    </section>
  );
}
