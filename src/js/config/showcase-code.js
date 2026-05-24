/**
 * Simulated backend codebase for the Interactive PHP MVC Request visualizer.
 * Displays real-world, high-fidelity PHP and SQL to developers/recruiters.
 */
export const showcaseCode = {
  router: {
    filename: "routes/api.php",
    language: "php",
    description: "Registers the API route, mapping the incoming HTTP GET request to the ProjectController class and binding the request-sanitization middleware.",
    code: `<?php

use App\\Http\\Controllers\\ProjectController;
use App\\Http\\Middleware\\SanitizeInput;
use App\\Support\\Facades\\Route;

/*
|--------------------------------------------------------------------------
| API Routes Configuration
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Map GET /api/v1/projects to index() and chain the protection middleware
    Route::get('/projects', [ProjectController::class, 'index'])
         ->middleware(SanitizeInput::class);
});`,
    highlights: [14, 15, 16]
  },

  middleware: {
    filename: "app/Http/Middleware/SanitizeInput.php",
    language: "php",
    description: "Acts as a security boundary filter. Iterates through all query parameters to sanitize HTML tags and escape SQL Injection / XSS scripts.",
    code: `<?php

namespace App\\Http\\Middleware;

use App\\Support\\Http\\Request;
use Closure;

class SanitizeInput
{
    /**
     * Handle an incoming request, stripping XSS vectors.
     */
    public function handle(Request $request, Closure $next)
    {
        $input = $request->all();

        array_walk_recursive($input, function (&$value) {
            if (is_string($value)) {
                // Strip HTML tags and escape malicious scripts
                $value = htmlspecialchars(strip_tags($value), ENT_QUOTES, 'UTF-8');
            }
        });

        $request->merge($input);

        return $next($request);
    }
}`,
    highlights: [17, 18, 19, 20]
  },

  controller: {
    filename: "app/Http/Controllers/ProjectController.php",
    language: "php",
    description: "Processes request inputs, queries the Project model for data matching criteria, and handles graceful error boundaries.",
    code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Project;
use App\\Support\\Http\\Request;
use App\\Support\\Http\\JsonResponse;
use Exception;

class ProjectController extends Controller
{
    /**
     * Fetch projects matching filter category.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $category = $request->query('category', 'all');

            // Query database via our Model
            $projects = Project::fetchByCategory($category);

            return JsonResponse::success([
                'status' => 'success',
                'count' => count($projects),
                'data' => $projects
            ]);

        } catch (Exception $e) {
            // Log error cleanly, hide internal stack traces from visitors
            logger()->error("Failed to query projects: " . $e->getMessage());

            return JsonResponse::error('Failed to retrieve portfolio data.', 500);
        }
    }
}`,
    highlights: [18, 20, 21, 23]
  },

  model: {
    filename: "app/Models/Project.php",
    language: "php",
    description: "Encapsulates database access. Communicates with MySQL via secure PDO parameter bindings to prevent SQL injections.",
    code: `<?php

namespace App\\Models;

use App\\Support\\Database\\DB;
use PDO;

class Project
{
    /**
     * Query projects matching a filter category securely using prepared statements.
     */
    public static function fetchByCategory(string $category): array
    {
        $db = DB::connect();

        $sql = "SELECT p.*, GROUP_CONCAT(s.title) as skill_tags
                FROM projects p
                LEFT JOIN project_skills ps ON p.id = ps.project_id
                LEFT JOIN skills s ON ps.skill_id = s.id
                WHERE p.status = :status";

        if ($category !== 'all') {
            $sql .= " AND p.category = :category";
        }

        $sql .= " GROUP BY p.id ORDER BY p.created_at DESC";

        $stmt = $db->prepare($sql);
        $stmt->bindValue(':status', 'active', PDO::PARAM_STR);

        if ($category !== 'all') {
            $stmt->bindValue(':category', $category, PDO::PARAM_STR);
        }

        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}`,
    highlights: [16, 17, 18, 19, 20, 31, 37]
  },

  database: {
    filename: "database/migrations/schema.sql",
    language: "sql",
    description: "Optimized relational database schema mapping tables with foreign key constraints, indexes on lookup criteria, and cascade rules.",
    code: `-- CREATE PROJECTS CORE TABLE
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- CREATE ASSOC SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) UNIQUE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- PIVOT TABLE WITH FOREIGN KEYS
CREATE TABLE IF NOT EXISTS project_skills (
    project_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY (project_id, skill_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- OPTIMIZE QUERY INDEXING
CREATE INDEX idx_project_category ON projects(category);
CREATE INDEX idx_project_status ON projects(status);`,
    highlights: [18, 20, 21, 25, 26]
  }
};
