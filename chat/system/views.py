from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib import auth
from django.contrib.auth.models import Group
from django.http import HttpResponse,JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST,require_GET
from django.contrib.auth.decorators import login_required, user_passes_test

import os
from pymongo import MongoClient
import json

from chat.models import Room

# client = MongoClient('mongodb://yzu_digiedu:yzu_digiedu_2017@140.138.77.91/digiedu?authMechanism=SCRAM-SHA-1')
client = MongoClient('mongodb://localhost:27017/digiedu')
db = client['digiedu']
media_dir = 'media/'

def is_teacher(user):
    return user.groups.filter(name='Teacher').exists()

def handle_uploaded_file(f,GameName,FileType): # ensure that large file doesn't overwhelm memory    
    path = media_dir+GameName+'/'+FileType+'/'
    os.makedirs(path, exist_ok=True)
    with open(path+f.name,'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)

@csrf_exempt  
# Create your views here.
def hello(request):
    return HttpResponse("hello")

# @csrf_exempt
@require_POST
def login(request):
    
    name = request.POST.get('username','') # 如果沒有這個key 則使用default
    password = request.POST.get('password','')
    user = auth.authenticate(username=name, password=password)

    if user is not None and user.is_active: # find user and back
        auth.login(request, user)
        message = '登入成功'
    else:
        message = '登入失敗'
    return HttpResponse(message)

def logout(request):
    auth.logout(request)
    return HttpResponse('登出')

@csrf_exempt
@require_POST
def addUser(request):
    
    name = request.POST.get('username','')
    # mail = request.POST.get('email','')
    password = request.POST.get('password','')
    try:
        user = User.objects.get(username=name)
    except:
        user = None

    if user != None: # 帳號存在
        message = user.username + " 帳號已存在!"
        return HttpResponse(message)
    else:	# create account			
        # user = User.objects.create_user(name,mail,password)
        user = User.objects.create_user(username=name, password=password)
        user.is_staff = True	# 可否登入後台
        user.save()
        return HttpResponse("建立成功")

@login_required
@require_GET
def ReadGame(request,GameName): # Read [Get]
    if (not request.user.groups.filter(name=GameName).exists()) and (not request.user.is_superuser):
        return HttpResponse("No Permission",status=403)
    try:
        coll = db['Game']
        res = list(coll.find({'name':GameName},{'_id':0}))
    except:
        return HttpResponse(status=500)

    if res==[]:
        return HttpResponse('Not '+ id,status=202)
    else:
        obj = {}
        obj['PPT'] = res[0]['PPT']
        return JsonResponse(obj,status=200)

# @login_required
@require_POST
def addGame(request): # Create [POST]
    try:
        coll = db['Game']
        GameJson = json.loads(request.body.decode('utf-8'))
        res = coll.insert_one(GameJson)
        newGroup = Group.objects.create(name=GameJson['GameName'])
        newGroup.save()
    except:
        return HttpResponse(status=500)
    return HttpResponse(status=200)

# @login_required
@require_POST
def addGameData(request):
    try:
        coll = db['GameData']
        res = coll.insert_one(json.loads(request.body.decode('utf-8')))
    except:
        return HttpResponse(status=500)
    return HttpResponse(status=200)

'''
find GameData Here
'''

@require_POST
def Uploader(request):
    if request.FILES['file']:
        myFile = request.FILES['file']
        GameName = request.POST.get('GameName','error')
        FileType = request.POST.get('FileType','another')
        try:
            handle_uploaded_file(myFile,GameName,FileType)
            return HttpResponse('Success Upload',status=200)
        except:
            return HttpResponse('File Save Error',status=403)
    else:
        return HttpResponse('QQ error Upload',status=403)

# @login_required
@require_POST
def get_all_rooms(request):

    username = request.POST.get('username')
    rooms = Room.objects.filter(teacher=username).order_by('-timestamp')
    res = []
    for room in rooms:
        res.append({
          'isActive': room.isActive==1,
          'teacher': room.teacher,
          'label': room.label,
          'game': room.game
        })
    return JsonResponse({"rooms":res}, status=200)