import React from "react";

export function StatisticalMapSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-qxnet-50 to-white">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Companies in Australia
          </h2>
        </div>
    
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md border border-qxnet-100">
          <div className="relative" style={{ height: "500px" }}>
            <iframe
              src="/australia-map/map.html"
              width="100%"
              height="100%"
              style={{ border: "none", backgroundColor: "white" }}
              title="Australia Region Map"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}