import { create } from "zustand";

export const artistVerificationStatuses = ["pending", "approved", "requires_action", "rejected"] as const;
export type ArtistVerificationStatus = (typeof artistVerificationStatuses)[number];

export type ArtistApplication = {
  reference: string;
  artistName: string;
  submittedAt: string;
  reviewTimeframe: string;
  status: ArtistVerificationStatus;
  issues: string[];
  rejectionReason: string;
  lastUpdate: string;
};

export type CorrectionDetails = {
  legalName: string;
  address: string;
  documentName: string;
};

export const initialArtistApplication: ArtistApplication = {
  reference: "IAAA-ART-24117",
  artistName: "Nomsa Mbewe",
  submittedAt: "24 November 2026, 14:32",
  reviewTimeframe: "2–3 business days",
  status: "pending",
  issues: [
    "The identity document photo is blurred. Upload a clear, uncropped image with all four corners visible.",
    "Confirm your current residential address, including the city and country.",
  ],
  rejectionReason:
    "We could not match the name on the identity document with the name on your artist account. You can appeal this decision or contact our support team for guidance.",
  lastUpdate: "Application received",
};

/** Existing artist fixtures are already approved; only a newly joined artist uses this gate. */
export function canOpenCreatorDashboard(artist: string, status: ArtistVerificationStatus) {
  return artist !== "new" || status === "approved";
}

type ArtistVerificationState = {
  application: ArtistApplication;
  setPreviewStatus: (status: ArtistVerificationStatus) => void;
  submitCorrection: (details: CorrectionDetails) => boolean;
  submitAppeal: (reason: string) => boolean;
  resetPreview: () => void;
};

export const useArtistVerificationStore = create<ArtistVerificationState>()((set, get) => ({
  application: structuredClone(initialArtistApplication),
  setPreviewStatus: (status) =>
    set((state) => ({
      application: {
        ...state.application,
        status,
        lastUpdate:
          status === "approved"
            ? "Approved preview"
            : status === "requires_action"
              ? "Corrections requested"
              : status === "rejected"
                ? "Decision preview"
                : "Application received",
      },
    })),
  submitCorrection: (details) => {
    if (get().application.status !== "requires_action") return false;
    set((state) => ({
      application: {
        ...state.application,
        artistName: details.legalName,
        status: "pending",
        submittedAt: "Just now",
        lastUpdate: `Corrections preview submitted with ${details.documentName}; address confirmed as ${details.address}`,
      },
    }));
    return true;
  },
  submitAppeal: (reason) => {
    if (get().application.status !== "rejected" || reason.trim().length < 20) return false;
    set((state) => ({
      application: {
        ...state.application,
        status: "pending",
        submittedAt: "Just now",
        lastUpdate: "Appeal preview submitted for review",
      },
    }));
    return true;
  },
  resetPreview: () => set({ application: structuredClone(initialArtistApplication) }),
}));
