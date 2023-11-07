package webapp.data;

import java.io.Serializable;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.dbcp2.BasicDataSource;

import com.electronwill.nightconfig.core.file.FileConfig;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;
import webapp.Intersector;

/**
 * Adapter for database
 * 
 * Does not hold actual state. Database is used as single source of truth
 */
@Named
@ApplicationScoped
public class AreaDataBean implements Serializable {
    private static final Intersector intersector = new Intersector();
    private static final BasicDataSource database = new BasicDataSource();

    static {
        System.out.println("Path is" + Paths.get("").toAbsolutePath());
        // classes are stored in separation from static resources
        final var config = FileConfig.of("database.toml");
        config.load();
        final String database_path = config.get("db_path");
        final String database_user = config.get("user");
        final String database_password = config.get("password");

        database.setUrl(database_path);
        database.setUsername(database_user);
        database.setPassword(database_password);
        database.setMinIdle(5);
        database.setMaxIdle(10);
        database.setMaxOpenPreparedStatements(100);
    }

    public AreaDataBean() {
        super();
    }

    public void proposePoint(double x, double y, double scale) throws SQLException {
        final var start = System.nanoTime();
        // make calculation with point
        final var point = new Point(x, y, scale);
        final boolean isIntersects = intersector.intersect(point);

        final var end = System.nanoTime();
        final var duration = end - start;
        // store results into bean

        final var executionResult = new ExecutionResult();
        executionResult.setPoint(point);
        executionResult.setCalculatedAt(Instant.now());
        executionResult.setCalculationTime(duration / 1_000);
        executionResult.setResult(isIntersects);
        // store results into database
        addToDatabase(executionResult);
    }

    private void addToDatabase(ExecutionResult result) throws SQLException {
        final var connection = database.getConnection();
        final var statement = connection.prepareStatement("INSERT INTO area_results VALUES (?, ?, ?, ?, ?, ?);");
        statement.setDouble(1, result.getPoint().getX());
        statement.setDouble(2, result.getPoint().getY());
        statement.setDouble(3, result.getPoint().getScale());
        statement.setBoolean(4, result.getResult());
        statement.setTimestamp(5, Timestamp.from(result.getCalculatedAt()));
        statement.setLong(6, result.getCalculationTime());

        statement.execute();
        statement.closeOnCompletion();
        connection.close();
    }

    public List<ExecutionResult> getPoints() throws SQLException {
        // retrieve full list of points from database
        final var connection = database.getConnection();
        final var statement = connection.prepareStatement("SELECT * FROM area_results;");
        final var list = new ArrayList<ExecutionResult>(100);

        final var results = statement.executeQuery();
        
        while(results.next()) {
            final var element = new ExecutionResult();
            final double x = results.getDouble(1);
            final double y = results.getDouble(2);
            final double scale = results.getDouble(3);

            final var point = new Point(x, y, scale);
            element.setPoint(point);

            element.setResult(results.getBoolean(4));
            element.setCalculatedAt(results.getTimestamp(5).toInstant());
            element.setCalculationTime(results.getLong(6));

            list.add(element);
        }

        results.close();
        statement.close();
        connection.close();
        return list;
    }




}
