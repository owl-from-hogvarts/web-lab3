package webapp;

import webapp.data.Point;

public class Intersector {

  public boolean intersect(Point point) {
    if (point.getX() > 0 && point.getY() > 0) {
      return intersectRectangle(point);
    }

    if (point.getX() <= 0 && point.getY() >= 0) {
      return intersectCircle(point);
    }

    if (point.getX() <= 0 && point.getY() <= 0) {
      return false;
    }

    if (point.getX() >= 0 && point.getY() <= 0) {
      return intersectTriangle(point);

    }

    return false;
  }

  private boolean intersectCircle(Point point) {
    return Math.sqrt(Math.pow(point.getX(), 2d) + Math.pow(point.getY(), 2d)) <= halfRadius(point);
  }

  private boolean intersectTriangle(Point point) {
    return (Math.abs(point.getX()) + Math.abs(point.getY())) < point.getScale();
  }

  private boolean intersectRectangle(Point point) {
    return Math.abs(point.getX()) <= point.getScale() && Math.abs(point.getY()) <= point.getScale();
  }

  private static double halfRadius(Point point) {
    return point.getScale() / 2;
  }
}
