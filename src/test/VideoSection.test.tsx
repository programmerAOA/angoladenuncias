import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import VideoSection from "@/components/VideoSection";

describe("VideoSection", () => {
  it("renderiza sem crash", () => {
    render(
      <MemoryRouter>
        <VideoSection
          videos={[
            {
              id: "1",
              title: "Teste",
              description: "desc",
              thumbnail: "",
              duration: "10:00",
              views: "10",
              category: "Vídeo",
              video_url: "https://www.youtube.com/watch?v=abc",
            },
          ]}
        />
      </MemoryRouter>
    );
    expect(screen.getByText("Noticiário em Vídeo Sem Filtros")).toBeInTheDocument();
  });
});
