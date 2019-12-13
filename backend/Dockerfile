FROM python:3.6
WORKDIR /backend
COPY app.py app.py
COPY requirements.txt requirements.txt
EXPOSE 5000
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
ENTRYPOINT ["python", "app.py"]