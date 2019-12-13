FROM python:3.6
WORKDIR /backend
COPY app.py app.py
COPY requirements.txt requirements.txt
ENV FLASK_APP app.py
ENV FLASK_RUN_HOST 0.0.0.0
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
CMD ["flask", "run"]