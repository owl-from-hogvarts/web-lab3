package webapp;

import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.json.JsonMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet(urlPatterns = "/WEB-INF/getPoints")
public class PointsServlet extends HttpServlet {
  private static final ObjectMapper objectMapper = JsonMapper.builder().findAndAddModules().enable(SerializationFeature.WRAP_ROOT_VALUE).build();

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    final var userData = PointsHelper.getPointsSafe(req.getSession());
    objectMapper.writeValue(resp.getWriter(), userData);
  }
  
}
