# Chu/Tong/To Family Tree

An interactive, visual family tree map representing the Chu, Tong, and To families.

![Family Tree Screenshot](assets/screenshot.png)

## Features
-   **Interactive Map**: Zoom and Pan to explore the lineages.
-   **Visual Grouping**: Color-coded family branches (Chu=Blue, Tong=Red, To=Green).
-   **Profile Cards**: Click on any person to see a large profile popup.
-   **Beautiful Design**: Parchment background with bold, readable typography.

## How to Run Locally

1.  Open your terminal.
2.  Navigate to the project directory:
    ```bash
    cd family_tree_map
    ```
3.  Start a local server:
    ```bash
    python3 -m http.server 8080
    ```
4.  Open your browser and visit `http://localhost:8080/index.html`.

## How to Publish to GitHub pages

You do **not** need to make any code modifications to publish this.

1.  **Create a Repository**: Go to GitHub.com and create a new public repository (e.g., `family-tree`).
2.  **Upload Files**: Upload all the files from this folder (`index.html`, `js/`, `css/`, `assets/`) to the repository.
3.  **Enable Pages**:
    -   Go to **Settings** > **Pages** on your repository.
    -   Under **Source**, select `Deploy from a branch`.
    -   Select `main` (or `master`) branch and `/ (root)` folder.
    -   Click **Save**.
4.  **Done!** GitHub will give you a link (e.g., `yourusername.github.io/family-tree`) where the site is live.
