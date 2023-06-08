import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  OrderClient,
  ReportIncomeOverTime,
  Restaurant,
  RestaurantClient,
  TimeLine,
} from "src/app/ngswag/client";

@Component({
  selector: "app-chart-revenue",
  templateUrl: "./chart-revenue.component.html",
  styleUrls: ["./chart-revenue.component.scss"],
})
export class ChartRevenueComponent implements OnInit {
  data: any;
  options: any;
  restaurant: Restaurant = Restaurant.fromJS({});
  offset = 0;
  periods: {
    name: string;
    identifier: TimeLine;
  }[] = [
    {
      name: "Week",
      identifier: "WEEK",
    },
    {
      name: "Month",
      identifier: "MONTH",
    },
    {
      name: "Year",
      identifier: "YEAR",
    },
  ];

  selectedPeriod: {
    name: string;
    identifier: TimeLine;
  } = this.periods[0];

  constructor(
    private $orderClient: OrderClient,
    private $router: Router,
    private $route: ActivatedRoute,
    private $restaurantClient: RestaurantClient
  ) {
    const id: number = Number.parseInt(
      <string>this.$route.snapshot.paramMap.get("id")
    );

    this.restaurant.id = id;
  }

  private initGraph() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    this.data = {
      labels: [],
      datasets: [
        {
          type: "line",
          label: "Sales",
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          data: [],
          yAxisID: "y",
        },
        {
          type: "bar",
          label: "Number of Completed Orders",
          backgroundColor: documentStyle.getPropertyValue("--green-500"),
          data: [],
          borderColor: "white",
          borderWidth: 2,
          yAxisID: "y1",
          stack: "stack",
        },
        {
          type: "bar",
          label: "Number of Aborted Orders",
          backgroundColor: documentStyle.getPropertyValue("--red-500"),
          data: [],
          borderColor: "white",
          borderWidth: 2,
          yAxisID: "y1",
          stack: "stack",
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          title: {
            display: true,
            text: "Sales (VND)",
          },
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y1: {
          title: {
            display: true,
            text: "Number of Orders",
          },
          ticks: {
            color: textColorSecondary,
            stepSize: 1,
          },
          grid: {
            color: surfaceBorder,
          },
          position: "right",
          stacked: true,
        },
      },
    };
  }

  getLabels(): string[] {
    if (this.selectedPeriod.identifier === "WEEK") {
      const today = new Date();
      const days = [
        new Date(today.getTime() - 1000 * 60 * 60 * 24 * (6 + 7 * this.offset)),
        new Date(today.getTime() - 1000 * 60 * 60 * 24 * (5 + 7 * this.offset)),
        new Date(today.getTime() - 1000 * 60 * 60 * 24 * (4 + 7 * this.offset)),
        new Date(today.getTime() - 1000 * 60 * 60 * 24 * (3 + 7 * this.offset)),
        new Date(today.getTime() - 1000 * 60 * 60 * 24 * (2 + 7 * this.offset)),
        new Date(today.getTime() - 1000 * 60 * 60 * 24 * (1 + 7 * this.offset)),
        new Date(today.getTime() - 1000 * 60 * 60 * 24 * (0 + 7 * this.offset)),
      ];

      return days.map(
        (d) =>
          `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${d.getFullYear()}`
      );
    } else if (this.selectedPeriod.identifier === "MONTH") {
      const today = new Date();
      today.setDate(15);
      today.setMonth(today.getMonth() - this.offset);
      const date = new Date(today.getFullYear(), today.getMonth(), 1);
      const days: Date[] = [];
      while (date.getMonth() === today.getMonth()) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }

      return days.map(
        (d) =>
          `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${d.getFullYear()}`
      );
    } else if (this.selectedPeriod.identifier === "YEAR") {
      const thisYear = new Date().getFullYear() - this.offset;

      return [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ].map((m) => `${m}-${thisYear}`);
    }

    return [];
  }

  ngOnInit() {
    this.$restaurantClient
      .getById(this.restaurant.id!)
      .subscribe((restaurant) => (this.restaurant = restaurant));

    this.refreshGraph();
  }

  refreshGraph() {
    this.$orderClient
      .getReportIncomeOverTime(
        this.restaurant.id!,
        this.selectedPeriod.identifier,
        this.offset
      )
      .subscribe((results) => {
        this.initGraph();

        const newResults = this.getLabels().map((label) => {
          const found = results.find((r) => r.label === label);
          return (
            found ||
            new ReportIncomeOverTime({
              label: label,
              totalOrders: 0,
              totalSales: 0,
            })
          );
        });

        this.data.labels = newResults.map((r) => r.label);
        this.data.datasets[0].data = newResults.map((r) => r.totalSales);
        this.data.datasets[1].data = newResults.map(
          (r) => r.totalCompletedOrders
        );
        this.data.datasets[2].data = newResults.map(
          (r) => r.totalAbortedOrders
        );
      });
  }

  prev() {
    this.offset++;
    this.refreshGraph();
  }

  next() {
    this.offset--;
    this.refreshGraph();
  }

  changePeriod() {
    this.offset = 0;
    this.refreshGraph();
  }
}
