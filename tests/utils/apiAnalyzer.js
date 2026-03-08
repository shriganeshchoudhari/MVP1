import fs from 'fs';
import path from 'path';

class APIAnalyzer {
    constructor() {
        this.apiCalls = [];
        this.currentModule = 'Setup';
    }

    /**
     * Call this before each module starts to tag the API calls with the module name.
     */
    setModule(moduleName) {
        this.currentModule = moduleName;
    }

    /**
     * Start intercepting requests and responses on the page.
     */
    startLogging(page) {
        page.on('response', async (response) => {
            const request = response.request();
            const resourceType = request.resourceType();

            // Only log XHR and Fetch requests (APIs)
            if (resourceType === 'xhr' || resourceType === 'fetch') {
                const url = request.url();

                // Optional: Filter out known non-API tracking/metrics domains if necessary
                if (url.includes('google-analytics') || url.includes('clarity')) return;

                let postData = request.postData();
                try {
                    // Try to format postData as JSON if possible
                    if (postData) {
                        postData = JSON.parse(postData);
                    }
                } catch (e) {
                    // Leave it as a string if not parseable JSON
                }

                this.apiCalls.push({
                    module: this.currentModule,
                    method: request.method(),
                    url: url,
                    status: response.status(),
                    resourceType: resourceType,
                    payload: postData || null,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    /**
     * Generate a Markdown report of all captured API calls.
     */
    generateReport(outputPath = 'test-results/api-analysis-report.md') {
        // Ensure directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        let reportContent = '# API Call Analysis Report\n\n';
        reportContent += `Generated at: ${new Date().toLocaleString()}\n\n`;

        // Group calls by module
        const grouped = this.apiCalls.reduce((acc, call) => {
            acc[call.module] = acc[call.module] || [];
            acc[call.module].push(call);
            return acc;
        }, {});

        for (const [moduleName, calls] of Object.entries(grouped)) {
            reportContent += `## ${moduleName}\n\n`;
            if (calls.length === 0) {
                reportContent += '*No API calls detected during this module.*\n\n';
                continue;
            }

            reportContent += '| Method | Status | URL |\n';
            reportContent += '|---|---|---|\n';

            for (const call of calls) {
                // Truncate URL for table readability
                const shortUrl = call.url.length > 80 ? call.url.substring(0, 77) + '...' : call.url;

                let statusIcon = '🟢';
                if (call.status >= 400 && call.status < 500) statusIcon = '🟠';
                if (call.status >= 500) statusIcon = '🔴';

                reportContent += `| **${call.method}** | ${statusIcon} ${call.status} | \`${shortUrl}\` |\n`;
            }
            reportContent += '\n';

            // Optional: Print detailed payload data for POST/PUT requests
            const postCalls = calls.filter(c => c.payload);
            if (postCalls.length > 0) {
                reportContent += `<details><summary><b>View Payloads for ${moduleName}</b></summary>\n\n`;
                for (const call of postCalls) {
                    reportContent += `**${call.method}** \`${call.url}\`\n`;
                    reportContent += '```json\n';
                    reportContent += JSON.stringify(call.payload, null, 2) + '\n';
                    reportContent += '```\n\n';
                }
                reportContent += `</details>\n\n`;
            }
        }

        fs.writeFileSync(outputPath, reportContent, 'utf-8');
        console.log(`\n✅ API Analysis Report generated at: ${outputPath}\n`);
    }
}

export default APIAnalyzer;
