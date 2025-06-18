from django import forms
from study.models import Subgroup


class SubgroupUpdateForm(forms.ModelForm):
    class Meta:
        model = Subgroup
        fields = ('title', 'level')


class SubgroupDeleteForm(forms.ModelForm):
    class Meta:
        model = Subgroup
        fields = ()
