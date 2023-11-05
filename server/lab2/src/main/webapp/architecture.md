

## Backend
ControllerServlet receives request. Checks whether it contains params or not

If not, passes request to index.jsp

Pass request to areaCheck only if request has params *and* `isJson` set.

## Frontend

On page load, request data from backend. If client encounters url params, right away send additional request to set new point.

Difference between AreaCheck and JSP is that AreaCheck return not just a form, but a table 

