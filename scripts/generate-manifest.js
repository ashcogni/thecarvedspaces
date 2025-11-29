import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resourcesDir = path.join(__dirname, '../public/resources');
const outputFile = path.join(__dirname, '../public/projects.json');

const categories = ['Interiors', 'Architecture', 'Landscape'];
const manifest = {};

// Ensure resources directory exists
if (!fs.existsSync(resourcesDir)) {
    console.error(`Error: Resources directory not found at ${resourcesDir}`);
    process.exit(1);
}

categories.forEach(category => {
    const categoryPath = path.join(resourcesDir, category);
    manifest[category] = [];

    console.log(`Checking category: ${category} at ${categoryPath}`);

    if (fs.existsSync(categoryPath)) {
        try {
            const projects = fs.readdirSync(categoryPath, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);

            projects.forEach(projectName => {
                const projectPath = path.join(categoryPath, projectName);
                try {
                    const images = fs.readdirSync(projectPath)
                        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
                        .map(file => `/resources/${category}/${projectName}/${file}`);

                    if (images.length > 0) {
                        manifest[category].push({
                            name: projectName,
                            thumbnail: images[0], // Use first image as thumbnail
                            images: images
                        });
                        console.log(`  Added project: ${projectName} with ${images.length} images`);
                    } else {
                        console.log(`  Skipping project ${projectName}: No images found`);
                    }
                } catch (err) {
                    console.error(`  Error reading project ${projectName}:`, err.message);
                }
            });
        } catch (err) {
            console.error(`Error reading category ${category}:`, err.message);
        }
    } else {
        console.log(`Category directory not found: ${categoryPath}`);
    }
});

fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));
console.log(`Successfully generated projects.json at ${outputFile}`);
// console.log(JSON.stringify(manifest, null, 2));
