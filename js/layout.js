const CONFIG = {
    NODE_WIDTH: 150,
    NODE_HEIGHT: 120,
    PARTNER_GAP: 30, // Distance between blood relative and partner
    SIBLING_GAP: 50,  // Distance between sibling groups
    LEVEL_HEIGHT: 200
};

/**
 * Recursively calculates the size of the subtree rooted at `node`.
 * Populates `node.treeWidth` and `node.contentWidth`.
 */
function calculateTreeSize(node) {
    // 1. Calculate width of this specific node unit (Blood + Partner)
    let contentWidth = CONFIG.NODE_WIDTH;
    if (node.partner) {
        contentWidth += CONFIG.PARTNER_GAP + CONFIG.NODE_WIDTH;
    }
    node.contentWidth = contentWidth;

    // 2. Calculate width of children
    if (!node.children || node.children.length === 0) {
        node.treeWidth = contentWidth;
        return contentWidth;
    }

    let childrenWidth = 0;
    node.children.forEach((child, index) => {
        childrenWidth += calculateTreeSize(child);
        if (index < node.children.length - 1) {
            childrenWidth += CONFIG.SIBLING_GAP;
        }
    });

    // The tree width is the max of the node's own width and its children's width
    node.treeWidth = Math.max(contentWidth, childrenWidth);
    return node.treeWidth;
}

/**
 * Recursively positions nodes.
 * @param {Object} node - Current node
 * @param {number} x - Left X position of the available space for this subtree
 * @param {number} y - Y position for this generation
 */
function positionNodes(node, x, y) {
    node.y = y;

    // Center the content (Blood + Partner) within the available tree width
    // The "tree" starts at x and has width node.treeWidth.
    // The content has width node.contentWidth.
    // So distinct start X for content is:
    const contentStartX = x + (node.treeWidth - node.contentWidth) / 2;

    // Blood relative position
    node.x = contentStartX;

    // Partner position (relative to blood relative)
    if (node.partner) {
        // Partner is to the right
        node.partnerX = node.x + CONFIG.NODE_WIDTH + CONFIG.PARTNER_GAP;
        node.partnerY = y;
    }

    // Position children
    if (node.children && node.children.length > 0) {
        let currentChildX = x;
        // If the children group is narrower than the parent, we essentially need to center the children group
        // relative to the parent.
        // Wait, `node.treeWidth` *is* determined by children if children are wider.
        // If parent is wider, we need to center the children block.

        let totalChildrenWidth = 0;
        node.children.forEach((child, i) => {
            totalChildrenWidth += child.treeWidth;
            if (i < node.children.length - 1) totalChildrenWidth += CONFIG.SIBLING_GAP;
        });

        if (totalChildrenWidth < node.treeWidth) {
            currentChildX = x + (node.treeWidth - totalChildrenWidth) / 2;
        }

        const nextY = y + CONFIG.LEVEL_HEIGHT;

        node.children.forEach((child, i) => {
            positionNodes(child, currentChildX, nextY);
            currentChildX += child.treeWidth + CONFIG.SIBLING_GAP;
        });
    }
}

function computeLayout(root) {
    calculateTreeSize(root);
    positionNodes(root, 0, 50); // Start at (0, 50)
    return root;
}
