"use client";

import { useState } from "react";
import Image from "next/image";

import { Download, Eye, FolderOpen, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import BackPrev from "@/components/back-prev";
import { ALBUMS, RangliConturAlbum } from "@/mock/colored";

export default function RangliConturPage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeAlbum, setActiveAlbum] = useState<RangliConturAlbum | null>(
    null,
  );

  const handlePreview = (album: RangliConturAlbum) => {
    setActiveAlbum(album);
    setPreviewOpen(true);
  };

  const downloadPng = (album: RangliConturAlbum) => {
    const link = document.createElement("a");
    link.href = album.combinedImage;
    link.download = `rangli-contur-${album.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="min-h-screen bg-linear-to-br from-sky-50 via-blue-50 to-emerald-50 px-4 py-8 text-slate-900">
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
          <BackPrev />
          {/* HEADER */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-down">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-1 border border-white/80 shadow-sm">
                <Palette className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-slate-700">
                  Rangli-Contur vositasi
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                🎨 Rangli-Contur albomlari
              </h1>
              <p className="text-slate-600 max-w-2xl text-sm sm:text-base">
                Har bir rasm bitta album-formatdagi fayl: chap tomonda rangli
                namunasi, o‘ng tomonda esa kontur bo‘yash uchun. O‘quvchilarga
                rasmlarni printerda chiqarib bering va ular rangli qismga qarab
                kontur qismini bo‘yashadi.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-start md:justify-end">
              {/* <Button
                variant="outline"
                className="rounded-xl text-xs sm:text-sm flex items-center gap-2"
                onClick={downloadAllZip}
              >
                <FileArchive className="w-4 h-4" />
                Barcha albomlarni ZIP yuklash
              </Button> */}
            </div>
          </header>

          {/* ALBUM LIST TITLE */}
          <div
            className="flex items-center gap-2 animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            <FolderOpen className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg sm:text-xl font-semibold">
              Albomlar ro‘yxati
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              {ALBUMS.length} ta albom
            </span>
          </div>

          {/* ALBUM GRID — 2 ta card bir qatorda */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ALBUMS.map((album, idx) => (
              <article
                key={album.id}
                className="bg-white/90 border border-white/70 rounded-3xl shadow-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${80 * idx}ms` }}
              >
                {/* ALBUM IMAGE (16:9) */}
                <div className="relative w-full aspect-10/9 bg-slate-100">
                  <Image
                    src={album.combinedImage}
                    alt={album.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
                  <div className="space-y-1 flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                      {album.title}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
                      <span
                        className={
                          "px-2 py-1 rounded-xl border " +
                          (album.level === "Easy"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                            : album.level === "Medium"
                              ? "bg-amber-50 border-amber-100 text-amber-600"
                              : "bg-rose-50 border-rose-100 text-rose-600")
                        }
                      >
                        Daraja: {album.level}
                      </span>
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="mt-2 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2"
                        onClick={() => handlePreview(album)}
                      >
                        <Eye className="w-4 h-4" />
                        Ko&apos;rish
                      </Button>
                      <Button
                        className="flex-1 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => downloadPng(album)}
                      >
                        <Download className="w-4 h-4" />
                        Yuklab olish
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl">
          {activeAlbum && (
            <>
              <DialogHeader className="px-5 pt-4 pb-3 border-b border-slate-100 bg-white/90 backdrop-blur-sm">
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  {activeAlbum.title}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-slate-500">
                  Chap tomonda rangli namunasi, o‘ng tomonda kontur bo‘yash
                  uchun. Rasmni yuklab olib, printerdan chiqarib, o‘quvchilarga
                  tarqatishingiz mumkin.
                </DialogDescription>
              </DialogHeader>

              <div className="bg-slate-50 p-3 sm:p-4">
                <div className="relative w-full max-w-3xl mx-auto aspect-video">
                  <Image
                    src={activeAlbum.combinedImage}
                    alt={activeAlbum.title}
                    fill
                    className="object-contain scale-110 rounded-2xl shadow-md bg-white"
                  />
                </div>
              </div>

              <div className="px-5 py-3 border-t border-slate-100 bg-white/90 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Maslahat: avval rangli qismni muhokama qiling, keyin
                  o‘quvchilardan kontur qismini xuddi shunday ranglab chiqishni
                  so‘rang.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs flex items-center gap-1"
                    onClick={() => downloadPng(activeAlbum)}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    yuklab olish
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
