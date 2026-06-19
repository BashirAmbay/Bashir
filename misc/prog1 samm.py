name = input("enter student name:") 

math = int(input("enter math score:"))
english = int(input("enter english score:"))
science = int(input("enter science score:"))
total = math + english + science
average = total / 3

print("Student Name:", name)
print("Total Score:", total)   
print("Average Score:", average)
if average >= 60:
    print("Status: Passed") 
else:   
    print("Status: Failed")    

print("Passed:", average >= 60)
print("Math Passed:", math >= 60)
print("English Passed:", english >= 60)
print("Science Passed:", science >= 60)     

bonus = 30
if average >= 90:
    bonus = 50  
print("Bonus Points:", bonus)
total_with_bonus = total + bonus
print("Total Score with Bonus:", total_with_bonus)  

print("New Total:", total_with_bonus)