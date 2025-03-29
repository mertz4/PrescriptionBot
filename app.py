import os
from flask import Flask, request, jsonify, render_template
from datetime import datetime, timedelta
from flask_mysqldb import MySQL
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = 'Prescription_Bot'

mysql = MySQL(app)  # Initialize MySQL


@app.route("/")
def home():
    return "Hello, !"


@app.route('/test', methods=['POST'])
def test():
    num = request.args.get('num')
    if num:
        # Process num
        return f"You entered: {num}"
    else:
        return "Num field is missing."



@app.route('/flattened_prescription_input', methods=['POST'])
def prescription_input():
    try:
        start_date_str = request.form['startDate']
        medication_name = request.form['medicationName']
        description_med = request.form['descriptionMed']
        duration_str = request.form['duration']
        frequency_str = request.form['frequency']
        pills_count_str = request.form['pillsCount']
        user_id_str = request.form['user_id']  # Get user ID

        # Parse input values, including user_id
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        duration = int(duration_str)
        pills_count = int(pills_count_str)
        user_id = int(user_id_str)  # convert user_id to int

        # Calculating end date
        end_date = start_date + timedelta(days=duration)

        # Parse frequency
        frequency_parts = frequency_str.split()
        frequency_value = int(frequency_parts[0])
        frequency_unit = frequency_parts[1].lower()

        # Calculating dosage schedule
        schedule = []
        current_date = start_date
        while current_date <= end_date:
            schedule.append(current_date.strftime('%Y-%m-%d'))
            if frequency_unit.startswith('day'):
                current_date += timedelta(days=frequency_value)
            elif frequency_unit.startswith('week'):
                current_date += timedelta(weeks=frequency_value)
            elif frequency_unit.startswith('month'):
                current_date += timedelta(days=frequency_value * 30)  # approximate month
            else:
                return jsonify({"error": "Invalid frequency unit. Use 'day', 'week', or 'month'"}), 400

        # Insert into database
        cur = mysql.connection.cursor()
        cur.execute(
            "INSERT INTO flattened_prescriptions (user_id, medication_name, description, start_date, end_date, frequency, pills_count) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (user_id, medication_name, description_med, start_date, end_date, frequency_str, pills_count))  # Corrected variable name
        mysql.connection.commit()
        cur.close()

        response = {
            'start_date': start_date.strftime('%Y-%m-%d'),
            'medication_name': medication_name,
            'description_med': description_med,
            'duration': duration,
            'end_date': str(prescription[5]),
            'frequency': frequency_str,
            'pills_count': pills_count,
            'schedule': schedule,
            'user_id': user_id
        }

        return jsonify(response), 201  # Use 201 for successful creation

    except (ValueError, KeyError) as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred: " + str(e)}), 500


@app.route('/flattened_prescriptions/<int:user_id>', methods=['GET'])
def get_user_prescriptions(user_id):
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM flattened_prescriptions WHERE user_id = %s", (user_id,))
        prescriptions = cur.fetchall()
        cur.close()

        if not prescriptions:
            return jsonify({"message": "No prescriptions found for this user"}), 200  # return 200

        # Convert the data into a list of dictionaries
        prescription_list = []
        for prescription in prescriptions:
            prescription_dict = {
                'id': prescription[0],  # Assuming 'id' is the first column
                'user_id': prescription[1],
                'medication_name': prescription[2],
                'description_med': prescription[3],
                'start_date': str(prescription[4]),
                'end_date': str(prescription[5]),
                'frequency': prescription[6],
                'pills_count': prescription[7],
                # Add other fields as necessary
            }
            prescription_list.append(prescription_dict)
        return jsonify(prescription_list), 200

    except Exception as e:
        return jsonify({"error": "An unexpected error occurred: " + str(e)}), 500


@app.route('/prescription/<int:prescription_id>', methods=['PUT'])
def update_prescription(prescription_id):
    try:
        # Get data from the form
        start_date_str = request.form.get('startDate')  # use .get
        medication_name = request.form.get('medicationName')
        description_med = request.form.get('descriptionMed')
        duration_str = request.form.get('duration')
        frequency_str = request.form.get('frequency')
        pills_count_str = request.form.get('pillsCount')
        user_id_str = request.form.get('user_id')

        # Data validation
        if not all([start_date_str, medication_name, description_med, duration_str, frequency_str, pills_count_str]):
            return jsonify({"error": "Missing required fields"}), 400

        # Parse data
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        duration = int(duration_str)
        pills_count = int(pills_count_str)
        user_id = int(user_id_str)
        end_date = start_date + timedelta(days=duration)

        # Parse frequency
        frequency_parts = frequency_str.split()
        frequency_value = int(frequency_parts[0])
        frequency_unit = frequency_parts[1].lower()

        # Calculate schedule
        schedule = []
        current_date = start_date
        while current_date <= end_date:
            schedule.append(current_date.strftime('%Y-%m-%d'))
            if frequency_unit.startswith('day'):
                current_date += timedelta(days=frequency_value)
            elif frequency_unit.startswith('week'):
                current_date += timedelta(weeks=frequency_value)
            elif frequency_unit.startswith('month'):
                current_date += timedelta(days=frequency_value * 30)
            else:
                return jsonify({"error": "Invalid frequency unit. Use 'day', 'week', or 'month'"}), 400

        # Update database
        cur = mysql.connection.cursor()
        cur.execute("""
            UPDATE flattened_prescriptions 
            SET user_id = %s, medication_name = %s, description = %s, start_date = %s, end_date = %s, 
            frequency = %s, pills_count = %s
            WHERE id = %s
        """, (user_id, medication_name, description_med, start_date, end_date, frequency_str, pills_count, prescription_id))
        mysql.connection.commit()
        cur.close()

        response = {
            'prescription_id': prescription_id,
            'start_date': str(prescription[4]),
            'medication_name': medication_name,
            'description_med': description_med,
            'duration': duration,
            'end_date': str(prescription[5]),
            'frequency': frequency_str,
            'pills_count': pills_count,
            'schedule': schedule,
            'user_id': user_id
        }
        return jsonify(response), 200
    except ValueError as ve:
        return jsonify({'error': f'Invalid data: {str(ve)}'}), 400
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred: " + str(e)}), 500

# New route to get all prescriptions
@app.route('/flattened_prescriptions', methods=['GET'])
def get_all_prescriptions():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM flattened_prescriptions")
        rows = cur.fetchall()
        cur.close()

        # Build a simple list of dicts assuming your table columns are:
        # (id, user_id, medication_name, description_med, start_date, end_date, frequency, pills_count)
        prescriptions = []
        for row in rows:
            prescriptions.append({
                "id": row[0],
                "user_id": row[1],
                "medication_name": row[2],
                "description_med": row[3],
                "start_date": str(row[4]),  # safely convert date to string
                "end_date": str(row[5]),
                "frequency": row[6],
                "pills_count": row[7]
            })

        return jsonify(prescriptions), 200

    except Exception as e:
        return jsonify({"error": "An unexpected error occurred: " + str(e)}), 500


@app.route('/flattened_prescriptions/<user_id>', methods=['GET'])
def get_flattened_prescriptions(user_id):
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM flattened_prescriptions WHERE user_id = %s", (user_id,))
        rows = cur.fetchall()
        cur.close()

        from collections import defaultdict

        users_data = defaultdict(list)

        for row in rows:
            user_id = row[1]
            prescription = {
                "prescription_id": row[0],
                "date_purch": str(row[2]),
                "tod": row[3],
                "medication_name": row[4],
                "description_med": row[5],
                "dosage": row[6],
                "pills_count": row[7],
                "frequency": row[8],
                "dow": row[9]
            }
            users_data[user_id].append(prescription)

        return jsonify(users_data), 200

    except Exception as e:
        return jsonify({"error": "Unexpected error: " + str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
