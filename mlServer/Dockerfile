FROM anibali/pytorch:no-cuda
EXPOSE 5000
WORKDIR app
COPY requirements.txt /app/
RUN cd /app/ && pip install -r requirements.txt


COPY * /app/
CMD flask run --host=0.0.0.0