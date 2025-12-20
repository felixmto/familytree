
function getInitials(name) {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function renderTree(root, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const nodes = [];
    const edges = [];

    function traverse(node, currentFamily = null) {
        // Determine family for this node
        let family = currentFamily;
        let isFamilyHead = false;

        if (node.familyId) {
            family = node.familyId;
            isFamilyHead = true; // This node defines a new family branch
        }

        // Blood Relative
        nodes.push({
            type: 'blood',
            x: node.x,
            y: node.y,
            name: node.birthday ? `${node.name} (${calculateAge(node.birthday)})` : node.name,
            image: node.image,
            id: node.id,
            family: family,
            isFamilyHead: isFamilyHead
        });

        // Partner
        if (node.partner) {
            nodes.push({
                type: 'partner',
                x: node.partnerX,
                y: node.partnerY,
                name: node.partner,
                image: node.partnerImage,
                id: node.id + '_partner',
                family: family
            });

            // Dashed connection
            edges.push({
                type: 'partner',
                x1: node.x + CONFIG.NODE_WIDTH,
                y1: node.y + CONFIG.NODE_HEIGHT / 2,
                x2: node.partnerX,
                y2: node.partnerY + CONFIG.NODE_HEIGHT / 2
            });
        }

        // Children Connections
        if (node.children && node.children.length > 0) {
            const sourceX = node.x + CONFIG.NODE_WIDTH / 2;
            const sourceY = node.y + CONFIG.NODE_HEIGHT;
            const midY = sourceY + 40;

            node.children.forEach(child => {
                const targetX = child.x + CONFIG.NODE_WIDTH / 2;
                const targetY = child.y;

                const pathData = `M ${sourceX} ${sourceY} 
                                  V ${midY} 
                                  H ${targetX} 
                                  V ${targetY}`;

                edges.push({
                    type: 'blood',
                    d: pathData
                });

                traverse(child, family);
            });
        }
    }

    traverse(root);

    // ViewBox Calcs
    const padding = 400; // Increased padding for better initial zoom comfort
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(n => {
        minX = Math.min(minX, n.x);
        minY = Math.min(minY, n.y);
        maxX = Math.max(maxX, n.x + CONFIG.NODE_WIDTH);
        maxY = Math.max(maxY, n.y + CONFIG.NODE_HEIGHT);
    });

    if (minX === Infinity) { minX = 0; minY = 0; maxX = 1000; maxY = 1000; }

    // We removed the fixed viewBox to allow our custom transform group to handle the "camera"
    // However, SVG needs a base size. We'll set it to 100% width/height in CSS, 
    // and use a <g> for all content that we transform.

    let svgHtml = `<svg id="main-svg" xmlns="http://www.w3.org/2000/svg">
        <g id="viewport">`;

    // 1. Edges
    edges.forEach(e => {
        if (e.type === 'partner') {
            svgHtml += `<line x1="${e.x1}" y1="${e.y1}" x2="${e.x2}" y2="${e.y2}" class="edge partner" />`;
        } else {
            svgHtml += `<path d="${e.d}" class="edge blood" />`;
        }
    });

    // 2. Nodes
    nodes.forEach(n => {
        const initials = getInitials(n.name);
        const isBlood = n.type === 'blood';
        const avatarParams = isBlood
            ? { fill: '#3b82f6', text: 'white' }
            : { fill: '#e2e8f0', text: '#64748b' };

        // Dimensions
        const imgSize = 70;
        const radius = imgSize / 2;
        const cx = CONFIG.NODE_WIDTH / 2;
        const cy = 15 + radius; // Top padding 15px

        let avatarContent;
        if (n.image) {
            // Use image if provided
            // ClipPath to make it circular
            const clipId = `clip-${n.id}`;
            avatarContent = `
                <defs>
                    <clipPath id="${clipId}">
                        <circle cx="${cx}" cy="${cy}" r="${radius}" />
                    </clipPath>
                </defs>
                <image x="${cx - radius}" y="${cy - radius}" width="${imgSize}" height="${imgSize}" href="${n.image}" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>
            `;
        } else {
            // Fallback to initials
            avatarContent = `
                <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${avatarParams.fill}" />
                <text x="${cx}" y="${cy}" dy="0.35em" text-anchor="middle" fill="${avatarParams.text}" font-size="24px" font-weight="bold">${initials}</text>
            `;
        }

        // Family Styling Class
        const familyClass = n.family ? `family-${n.family}` : '';

        // Family Label (only for family heads)
        let familyLabel = '';
        if (n.isFamilyHead) {
            let labelText = '';
            if (n.family === 'chu') labelText = 'Chu Family';
            if (n.family === 'tong') labelText = 'Tong Family';
            if (n.family === 'to') labelText = 'To Family';

            if (labelText) {
                familyLabel = `<text x="${CONFIG.NODE_WIDTH / 2}" y="-16" text-anchor="middle" class="family-label" fill="#64748b" font-weight="bold">${labelText}</text>`;
            }
        }

        svgHtml += `
        <g class="node ${n.type} ${familyClass}" transform="translate(${n.x}, ${n.y})" data-name="${n.name}" data-image="${n.image || ''}">
            ${familyLabel}
            <rect class="card-bg" width="${CONFIG.NODE_WIDTH}" height="${CONFIG.NODE_HEIGHT}" rx="16" />
            ${avatarContent}
            <text x="${CONFIG.NODE_WIDTH / 2}" y="${CONFIG.NODE_HEIGHT - 15}" class="name-label" text-anchor="middle">${n.name}</text>
        </g>`;
    });

    svgHtml += `</g></svg>`;
    container.innerHTML = svgHtml;

    // Return the bounds so main.js can center the view initially
    return { minX, minY, maxX, maxY };
}

function calculateAge(birthday) {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
