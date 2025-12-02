import React from "react";

export default function Footer() {
  return (
    <footer className="mt-12 bg-slate-900 text-slate-200 py-8">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h3 className="text-xl font-extrabold text-white">MAKAUT UNIVERSITY</h3>
        <p className="mt-2 text-slate-300">
          Department of Information Technology
        </p>

        <div className="mt-3 text-slate-400">
          <p>
            Main Campus: NH 12, Simhat Haringhata, Nadia, West Bengal, pin -
            741249
          </p>
          <p className="mt-1">
            city office: BF-142, sector-1, salt Lake, kolkata-700064
          </p>
          <p className="mt-1">☎ Phone: 03329991528</p>
        </div>

        <div className="mt-4 flex gap-4 justify-center flex-wrap">
          <a
            href="https://www.makautexam.net/"
            className="text-slate-200 font-semibold"
          >
            Website
          </a>
          <a
            href="https://facebook.com"
            className="text-slate-200 font-semibold"
          >
            Facebook
          </a>
          <a
            href="https://twitter.com"
            className="text-slate-200 font-semibold"
          >
            Twitter
          </a>
          <a
            href="https://instagram.com"
            className="text-slate-200 font-semibold"
          >
            Instagram
          </a>
        </div>

        <p className="mt-6 text-slate-400">
          © {new Date().getFullYear()} MAKAUT UNIVERSITY — All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
