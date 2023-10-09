package webapp;

import webapp.data.Point;

public class Intersector {
  private static final double RADIUS = 1d;
  private static final double HALF_RADIUS = RADIUS / 2d;


  public boolean intersect(Point point) {
    if (point.x() > 0 && point.y() > 0) {
      return false;
    }

    if (point.x() <= 0 && point.y() >= 0) {
      return intersectTopLeft(point);
    }

    if (point.x() <= 0 && point.y() <= 0) {
      return intersectBottomLeft(point);
    }

    if (point.x() >= 0 && point.y() <= 0) {
      return intersectBottomRight(point);
    }

    return false;
  }

  private boolean intersectBottomRight(Point point) {
    return Math.sqrt(Math.pow(point.x(), 2d) + Math.pow(point.y(), 2d)) <= HALF_RADIUS;
  }

  private boolean intersectBottomLeft(Point point) {
    return (Math.abs(point.x()) + Math.abs(point.y())) < HALF_RADIUS;
  }

  private boolean intersectTopLeft(Point point) {
    return Math.abs(point.x()) <= HALF_RADIUS  && Math.abs(point.y()) <= RADIUS;
  }
}
