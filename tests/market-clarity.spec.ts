import { test, expect, type ConsoleMessage, type Page } from "@playwright/test";

/*
  Rung 3 behavioral verification for batch B1. The fourteen assertions listed
  under B1 in BATCH_PLAN.md, in order. Assertion 2 (no hydration mismatch) is
  the highest value one on this page.
*/

const BASE = "http://localhost:3000";

type DataLayerEntry = { event?: string; location?: string };

const readDataLayer = (page: Page) =>
  page.evaluate<DataLayerEntry[]>(
    () => ((window as unknown as { dataLayer?: DataLayerEntry[] }).dataLayer ?? []).slice()
  );

const eventsNamed = (entries: DataLayerEntry[], name: string) =>
  entries.filter((e) => e && e.event === name);

test.describe("Market Clarity Live", () => {
  test("1. loads with the three H1 lines verbatim", async ({ page }) => {
    await page.goto(BASE);
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    const text = (await h1.innerText()).replace(/\s+/g, " ").trim();
    expect(text).toBe("STOP GUESSING WHAT THE MARKET IS DOING.");
  });

  test("2. no console errors and no hydration mismatch on load", async ({ page }) => {
    const errors: string[] = [];
    const hydration: string[] = [];

    const inspect = (msg: ConsoleMessage) => {
      const text = msg.text();
      if (msg.type() === "error") errors.push(text);
      if (/hydrat|did not match|server rendered|text content does not match/i.test(text)) {
        hydration.push(text);
      }
    };

    page.on("console", inspect);
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
    // Let the countdown mount and tick, which is when a mismatch would surface.
    await page.waitForTimeout(2000);

    // GA4 requests fail without a real Measurement ID, so ignore network noise
    // from googletagmanager. Everything else is a real failure.
    const real = errors.filter((e) => !/googletagmanager|gtag|ERR_|net::/i.test(e));

    expect(hydration, `hydration warnings: ${hydration.join(" | ")}`).toEqual([]);
    expect(real, `console errors: ${real.join(" | ")}`).toEqual([]);
  });

  test("3. countdown renders digits and the seconds value changes", async ({ page }) => {
    await page.goto(BASE);
    const seconds = page.getByTestId("countdown-seconds");
    await expect(seconds).toHaveText(/^\d{2}$/, { timeout: 5000 });

    const first = await seconds.innerText();
    await page.waitForTimeout(2100);
    const second = await seconds.innerText();

    expect(second).toMatch(/^\d{2}$/);
    expect(second).not.toBe(first);
  });

  test("4. countdown width is stable across three samples", async ({ page }) => {
    await page.goto(BASE);
    const chip = page.getByTestId("countdown");
    await expect(page.getByTestId("countdown-seconds")).toHaveText(/^\d{2}$/, { timeout: 5000 });

    const widths: number[] = [];
    for (let i = 0; i < 3; i++) {
      const box = await chip.boundingBox();
      widths.push(box!.width);
      await page.waitForTimeout(1000);
    }

    expect(widths[1]).toBeCloseTo(widths[0], 2);
    expect(widths[2]).toBeCloseTo(widths[0], 2);
  });

  test("5. countdown_view fires exactly once, and not again after scrolling", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.getByTestId("countdown-seconds")).toHaveText(/^\d{2}$/, { timeout: 5000 });

    expect(eventsNamed(await readDataLayer(page), "countdown_view")).toHaveLength(1);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(600);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);

    expect(eventsNamed(await readDataLayer(page), "countdown_view")).toHaveLength(1);
  });

  test("6. invalid email does not reach the success state", async ({ page }) => {
    await page.goto(BASE);
    await page.getByTestId("form-hero_form").getByLabel("FIRST NAME").fill("Alex");
    await page.getByTestId("form-hero_form").getByLabel("EMAIL").fill("not-an-email");
    await page.getByTestId("submit-hero_form").click();

    await expect(page.getByTestId("error-hero_form")).toBeVisible();
    await expect(page.getByTestId("success-hero_form")).toHaveCount(0);

    const entries = await readDataLayer(page);
    expect(eventsNamed(entries, "webinar_signup")).toHaveLength(0);
    // The press itself still counts as a cta_click.
    expect(eventsNamed(entries, "cta_click").length).toBeGreaterThan(0);
  });

  test("7. valid hero submit swaps to the success copy and fires hero_form", async ({ page }) => {
    await page.goto(BASE);
    await page.getByTestId("form-hero_form").getByLabel("FIRST NAME").fill("Alex");
    await page.getByTestId("form-hero_form").getByLabel("EMAIL").fill("alex@example.com");
    await page.getByTestId("submit-hero_form").click();

    await expect(page.getByTestId("success-hero_form")).toHaveText(
      "You are in. Check your inbox for the calendar invite."
    );

    const signups = eventsNamed(await readDataLayer(page), "webinar_signup");
    expect(signups).toHaveLength(1);
    expect(signups[0].location).toBe("hero_form");
  });

  test("8. the two forms fire distinguishable location params", async ({ page }) => {
    await page.goto(BASE);

    await page.getByTestId("form-final_form").getByLabel("FIRST NAME").fill("Marta");
    await page.getByTestId("form-final_form").getByLabel("EMAIL").fill("marta@example.com");
    await page.getByTestId("submit-final_form").click();
    await expect(page.getByTestId("success-final_form")).toBeVisible();

    let signups = eventsNamed(await readDataLayer(page), "webinar_signup");
    expect(signups).toHaveLength(1);
    expect(signups[0].location).toBe("final_form");

    await page.getByTestId("form-hero_form").getByLabel("FIRST NAME").fill("Alex");
    await page.getByTestId("form-hero_form").getByLabel("EMAIL").fill("alex@example.com");
    await page.getByTestId("submit-hero_form").click();
    await expect(page.getByTestId("success-hero_form")).toBeVisible();

    signups = eventsNamed(await readDataLayer(page), "webinar_signup");
    expect(signups).toHaveLength(2);
    expect(signups.map((s) => s.location).sort()).toEqual(["final_form", "hero_form"]);
  });

  test("9. submitting the hero form leaves the final form untouched", async ({ page }) => {
    await page.goto(BASE);
    await page.getByTestId("form-hero_form").getByLabel("FIRST NAME").fill("Alex");
    await page.getByTestId("form-hero_form").getByLabel("EMAIL").fill("alex@example.com");
    await page.getByTestId("submit-hero_form").click();
    await expect(page.getByTestId("success-hero_form")).toBeVisible();

    // D-06: independent state. The final form is still a live form.
    await expect(page.getByTestId("success-final_form")).toHaveCount(0);
    await expect(page.getByTestId("submit-final_form")).toBeVisible();
    await expect(page.getByTestId("form-final_form").getByLabel("EMAIL")).toHaveValue("");
  });

  test("10. the scroll progress bar scaleX increases on scroll", async ({ page }) => {
    await page.goto(BASE);
    const bar = page.getByTestId("scroll-progress");
    await expect(bar).toBeAttached();

    /*
      Measure the rendered width rather than parsing the transform matrix.
      framer-motion writes `transform: none` when scaleX reaches exactly 1,
      because scaleX(1) is the identity, so a matrix parser reports 0 at full
      scroll even though the bar is fully drawn. Width is what is visible and
      it is monotonic the whole way down.
    */
    const widthOf = async () => (await bar.boundingBox())!.width;

    const scrollToFraction = async (f: number) => {
      await page.evaluate((frac) => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, Math.round(max * frac));
      }, f);
      await page.waitForTimeout(700);
    };

    const atTop = await widthOf();
    await scrollToFraction(0.5);
    const atHalf = await widthOf();
    await scrollToFraction(1);
    const atBottom = await widthOf();

    expect(atHalf).toBeGreaterThan(atTop);
    expect(atBottom).toBeGreaterThan(atHalf);

    // At the bottom the bar spans the viewport.
    const viewport = page.viewportSize()!.width;
    expect(atBottom).toBeCloseTo(viewport, 0);
  });

  test("11. no horizontal overflow at 390px and both forms usable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

    for (const location of ["hero_form", "final_form"]) {
      const form = page.getByTestId(`form-${location}`);
      await form.scrollIntoViewIfNeeded();
      await form.getByLabel("FIRST NAME").fill("Alex");
      await form.getByLabel("EMAIL").fill("alex@example.com");
      await page.getByTestId(`submit-${location}`).click();
      await expect(page.getByTestId(`success-${location}`)).toBeVisible();
    }
  });

  test("12. reduced motion: no progress bar, no pulse, countdown still updates", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");

    // Decoration is gone.
    await expect(page.getByTestId("scroll-progress")).toHaveCount(0);

    const dotAnimation = await page
      .locator(".go-dot")
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(dotAnimation).toBe("none");

    // Content keeps moving.
    const seconds = page.getByTestId("countdown-seconds");
    await expect(seconds).toHaveText(/^\d{2}$/, { timeout: 5000 });
    const first = await seconds.innerText();
    await page.waitForTimeout(2100);
    expect(await seconds.innerText()).not.toBe(first);

    await context.close();
  });

  test("13. both forms are labeled with the correct autocomplete attributes", async ({ page }) => {
    await page.goto(BASE);

    for (const location of ["hero_form", "final_form"]) {
      const form = page.getByTestId(`form-${location}`);
      const name = form.getByLabel("FIRST NAME");
      const email = form.getByLabel("EMAIL");

      await expect(name).toHaveAttribute("autocomplete", "given-name");
      await expect(email).toHaveAttribute("autocomplete", "email");

      // getByLabel resolving at all proves the label is real and associated.
      await expect(name).toHaveCount(1);
      await expect(email).toHaveCount(1);
    }
  });

  /*
    Added during B1 verification. The original fourteen assertions all passed
    while the three what-you-get rows and both testimonials sat at opacity 0
    permanently, because the scroll reveal never fired for them. Copy that is
    invisible until an animation runs is a content bug, so it gets its own
    assertion in both motion modes.
  */
  test("15. revealed copy is actually visible after scrolling", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");

    const revealed = [
      "The week, decoded.",
      "The why behind the noise.",
      "Next week's watchlist.",
      "Forty five minutes on Thursday replaced two hours of doomscrolling every day.",
      "The first finance thing I have ever attended twice.",
    ];

    for (const text of revealed) {
      const node = page.getByText(text, { exact: false }).first();
      await node.scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await expect(node).toBeVisible();

      const opacity = await node.evaluate((el) => {
        let cur: HTMLElement | null = el as HTMLElement;
        let min = 1;
        while (cur && cur !== document.body) {
          min = Math.min(min, parseFloat(getComputedStyle(cur).opacity));
          cur = cur.parentElement;
        }
        return min;
      });
      expect(opacity, `"${text}" is transparent`).toBeGreaterThan(0.9);
    }
  });

  test("16. revealed copy is visible under reduced motion without scrolling", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);

    for (const text of ["The week, decoded.", "The first finance thing I have ever attended twice."]) {
      const opacity = await page
        .getByText(text, { exact: false })
        .first()
        .evaluate((el) => {
          let cur: HTMLElement | null = el as HTMLElement;
          let min = 1;
          while (cur && cur !== document.body) {
            min = Math.min(min, parseFloat(getComputedStyle(cur).opacity));
            cur = cur.parentElement;
          }
          return min;
        });
      expect(opacity, `"${text}" is transparent under reduced motion`).toBeGreaterThan(0.9);
    }

    await context.close();
  });

  test("14. the footer concept credit is present and linked", async ({ page }) => {
    await page.goto(BASE);
    const footer = page.locator("footer");
    await expect(footer).toContainText("Concept build. Designed and built by Isaac Olorode.");

    const link = footer.getByRole("link", { name: "isaac.aperio.finance/landing" });
    await expect(link).toHaveAttribute("href", "https://isaac.aperio.finance/landing");
  });
});
