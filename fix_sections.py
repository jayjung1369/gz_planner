import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Travel 섹션 끝부터 Guide 섹션까지의 중복 제거
# Travel 섹션의 마지막 </section> 태그 이후의 Guide 섹션을 찾아서 제거
pattern = r'(모든 장소를 확인했습니다\..*?</section>)\s*(<section class="section soft-section" id="guide">.*?</section>)\s*(<\s*/main>)'

def replace_func(match):
    before = match.group(1)
    # guide는 이미 앞에 추가되었으므로 제거
    after = match.group(3)
    return before + '\n\n  ' + after

content = re.sub(pattern, replace_func, content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('완료: Guide 중복 섹션이 제거되었습니다')
print('섹션 순서: Wedding → Guide → Planner → Travel')
