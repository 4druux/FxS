"use client";
import { WorldMapUi } from "./Ui/WorldMapUi";

export function WorldMap() {
  return (
    <div className="w-full h-full">
      <WorldMapUi
        dots={[
          {
            start: {
              lat: 44.2008,
              lng: -130.4937,
            }, // Alaska (Fairbanks)
            end: {
              lat: 0.0522,
              lng: -87.2437,
            }, // Los Angeles
          },
          {
            start: {
              lat: 44.2008,
              lng: -130.4937,
            }, // Alaska (Fairbanks)
            end: { lat: -20.7975, lng: -47.8919 }, // Brazil (Brasília)
          },
          {
            start: { lat: -20.7975, lng: -47.8919 }, // Brazil (Brasília)
            end: { lat: 32.7223, lng: -10.1393 }, // Lisbon
          },
          {
            start: { lat: 51.5074, lng: -0.1278 }, // London
            end: { lat: 28.6139, lng: 77.209 }, // New Delhi
          },
          {
            start: { lat: 28.6139, lng: 77.209 }, // New Delhi
            end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
          },
          {
            start: { lat: 28.6139, lng: 77.209 }, // New Delhi
            end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
          },
          {
            start: { lat: -5.231, lng: 110.209 }, // Singapore
            end: { lat: -25.5, lng: 117.5 }, // Jakarta, Indonesia
          },
          {
            start: { lat: -5.231, lng: 110.209 }, // Singapore
            end: { lat: -45.5, lng: 158.5 }, // Aussie
          },
        ]}
      />
    </div>
  );
}
