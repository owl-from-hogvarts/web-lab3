package webapp.data;

import java.io.Serializable;

import jakarta.enterprise.context.SessionScoped;
import jakarta.faces.application.FacesMessage;
import jakarta.faces.component.UIComponent;
import jakarta.faces.context.FacesContext;
import jakarta.faces.validator.ValidatorException;
import jakarta.inject.Named;

@Named
@SessionScoped
public class UserFormInput implements Serializable {
  private double x;
  private double y;
  private double scale = 2.0;

  public double getX() {
    return x;
  }

  public void setX(double x) {
    this.x = x;
  }

  public double getY() {
    return y;
  }

  public void setY(double y) {
    System.out.println("new value of y is " + y);
    this.y = y;
  }

  public double getScale() {
    return scale;
  }

  public void setScale(double scale) {
    System.out.println("new value of scale is " + scale);
    this.scale = scale;
  }

  @Override
  public String toString() {
    return "UserFormInputBean [x=" + x + ", y=" + y + ", scale=" + scale + "]";
  }

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    long temp;
    temp = Double.doubleToLongBits(x);
    result = prime * result + (int) (temp ^ (temp >>> 32));
    temp = Double.doubleToLongBits(y);
    result = prime * result + (int) (temp ^ (temp >>> 32));
    temp = Double.doubleToLongBits(scale);
    result = prime * result + (int) (temp ^ (temp >>> 32));
    return result;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj)
      return true;
    if (obj == null)
      return false;
    if (getClass() != obj.getClass())
      return false;
    UserFormInput other = (UserFormInput) obj;
    if (Double.doubleToLongBits(x) != Double.doubleToLongBits(other.x))
      return false;
    if (Double.doubleToLongBits(y) != Double.doubleToLongBits(other.y))
      return false;
    if (Double.doubleToLongBits(scale) != Double.doubleToLongBits(other.scale))
      return false;
    return true;
  }

    public void validateNonNull(FacesContext facesContext,
                                UIComponent uiComponent, Object o) {
        if (o == null) {
            FacesMessage message = new FacesMessage("Please, input Y!");
            throw new ValidatorException(message);
        }
    }
}
