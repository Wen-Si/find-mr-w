import ffmpeg

# 视频文件路径
video = ffmpeg.input('C:/Users/swok2/Desktop/final_new.mp4')

# 音频文件路径
audio = ffmpeg.input('C:/Users/swok2/Desktop/大赛/研究生金融科技创新大赛/第五届/音频/赛题2.mp3')

# 合并视频和音频，输出新文件
ffmpeg.concat(video, audio, v=1, a=1).output('C:/Users/swok2/Desktop/赛题2.mp4').run()