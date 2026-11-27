import { beforeEach, describe, expect, it } from "vitest";
import {
  canOpenCreatorDashboard,
  useArtistVerificationStore,
} from "@/stores/artist-verification";

describe("artist verification access", () => {
  beforeEach(() => useArtistVerificationStore.getState().resetPreview());

  it("blocks a new artist until the application is approved", () => {
    expect(canOpenCreatorDashboard("new", "pending")).toBe(false);
    expect(canOpenCreatorDashboard("new", "requires_action")).toBe(false);
    expect(canOpenCreatorDashboard("new", "rejected")).toBe(false);
    expect(canOpenCreatorDashboard("new", "approved")).toBe(true);
  });

  it("keeps existing approved artist fixtures available", () => {
    expect(canOpenCreatorDashboard("painter", "pending")).toBe(true);
  });

  it("returns a corrected application to pending review", () => {
    useArtistVerificationStore.getState().setPreviewStatus("requires_action");
    const changed = useArtistVerificationStore.getState().submitCorrection({
      legalName: "Nomsa Mbewe",
      address: "12 Kabulonga Road, Lusaka, Zambia",
      documentName: "clear-identity-document.jpg",
    });
    expect(changed).toBe(true);
    expect(useArtistVerificationStore.getState().application.status).toBe("pending");
  });

  it("does not accept a correction when none was requested", () => {
    const changed = useArtistVerificationStore.getState().submitCorrection({
      legalName: "Nomsa Mbewe",
      address: "12 Kabulonga Road, Lusaka, Zambia",
      documentName: "clear-identity-document.jpg",
    });
    expect(changed).toBe(false);
    expect(useArtistVerificationStore.getState().application.status).toBe("pending");
  });

  it("moves a sufficiently explained rejected appeal back to review", () => {
    useArtistVerificationStore.getState().setPreviewStatus("rejected");
    expect(useArtistVerificationStore.getState().submitAppeal("Too short")).toBe(false);
    expect(
      useArtistVerificationStore.getState().submitAppeal(
        "The identity document contains my full legal name and matches my account details.",
      ),
    ).toBe(true);
    expect(useArtistVerificationStore.getState().application.status).toBe("pending");
  });
});
